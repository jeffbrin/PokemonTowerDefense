import Vector from "../../lib/Vector.js";
import { CATCHABLE_HEALTH_PERCENTAGE, context, images, mousePosition, POKEMON_DATA, sounds, stateStack } from "../globals.js";
import GameEntity from "./GameEntity.js";
import Sprite from "../../lib/Sprite.js";
import SpriteSheetTile from "../enums/SpriteSheetTile.js";
import ImageName from "../enums/ImageName.js";
import Animation from "../../lib/Animation.js";
import Direction from "../enums/Direction.js";
import Tile from "../services/Tile.js";
import Hitbox from "../../lib/Hitbox.js";
import Stat from "../enums/Stat.js";
import PokedexNumber from "../enums/PokedexNumber.js";
import PokemonTower from "./PokemonTower.js";
import PokemonFactory from "../services/PokemonFactory.js";
import EvolvingState from "../states/entity/Pokemon/EvolvingState.js";
import LearnMoveState from "../states/entity/Pokemon/LearnMoveState.js";
import AttackFactory from "../services/AttackFactory.js";
import SoundName from "../enums/SoundName.js";
import Timer from "../../lib/Timer.js";

export default class Pokemon extends GameEntity
{

    static RENDER_OFFSET = new Vector(-Tile.SIZE / 2, -Tile.SIZE);

    /**
     * Creates a pokemon.
     * @param {PokedexNumber} pokedexNumber The pokemon's pokedex number.
     * @param {string} name The pokemon's name 
     * @param {Array} types The pokemon's type(s). 
     * @param {Array} baseStats The pokemon's base stats
     * @param {Number} level The pokemon's level. 
     * @param {Array} attacks This pokemon's attacks. 
     * @param {PokedexNumber} nextStagePokemon The name of the pokemon that this pokemon evolves into. 
     * @param {Number} evolutionLevel The level when this pokemon will level up.
     */
    constructor(
        pokedexNumber,
        name, types, baseStats, ivs, level, attacks = [], shiny = false, nextStagePokemon = null, evolutionLevel = null
    )
    {
        super(new Vector(), new Vector(Tile.SIZE, Tile.SIZE), new Hitbox(), Pokemon.RENDER_OFFSET);
        this.shiny = shiny;
        this.pokedexNumber = pokedexNumber;
        this.name = name;
        this.types = types;
        this.baseStats = baseStats;
        this.ivs = ivs;
        this.stats = [0, 0, 0, 0, 0, 0];
        this.pokemonLevel = level;
        this.calculateStats();
        this.nextStagePokemon = nextStagePokemon;
        this.attacks = attacks;
        this.animation = new Animation([0, 1], 1 - Math.log2(this.stats[Stat.Speed]) / 10);
        this.getSprites();
        this.direction = Direction.DOWN;
        this.sprites = this.directionalSprites[this.direction];
        this.selectedAttack = this.attacks[0];
        this.attackRange = PokemonTower.DEFAULT_RANGE;
        this.experience = this.currentLevelBaselineExperience();
        this.calculateNextLevelExperience();
        this.evolutionLevel = evolutionLevel;
        this.timer = new Timer();

        this.crySoundName = `Pokemon${this.pokedexNumber}`;
    }

    update(dt)
    {
        super.update(dt);
        this.sprites = this.directionalSprites[this.direction];

        if (!this.pickedUp){
            this.timer.update(dt);
        }
    }

    render(overridePosition = null, hideRange = false)
    {

        // Save the position
        const savedPosition = this.position;


        // Move to the mouse position if this pokemon is picked up
        //Sam - I had to move thisone under the above if statement for it to work, cause when I override it
        //wouldn't get set to the mouse position if picked up
        if (this.pickedUp)
        {
            this.position = new Vector(mousePosition.x - Tile.SIZE / 2, mousePosition.y - Tile.SIZE / 2);
        }



        if (overridePosition)
            this.position = overridePosition;

        // Render
        // Render range indicator if picked up
        if (this.pickedUp && !hideRange)
            this.renderRangeIndicator();
        // Render pokemon
        if (this.direction == Direction.RIGHT)
        {
            context.save();
            // Set greyscale if necessary
            if (this.renderGreyscale)
                this.setGreyscale();

            context.translate(Math.floor(this.position.x) + this.dimensions.x, Math.floor(this.position.y));
            context.scale(-1, 1);
            this.sprites[this.animation.getCurrentFrame()].render(this.renderOffset.x, this.renderOffset.y);
            context.restore();
            super.renderHitbox();
        }
        else
        {
            // Set greyscale if necessary
            if (this.renderGreyscale)
                this.setGreyscale();
            super.render();
            context.restore();
        }

        // Set the position back in case it was changed by pickedUp
        this.position = savedPosition;


    }

    setGreyscale()
    {
        context.save();
        context.fillStyle = '#fff';
        context.globalCompositeOperation = 'luminosity';
    }

    getSprites()
    {

        const doubledSpritesPokedexNumbers = [3, 25];

        const COLS_IN_SPRITESHEET = 32;

        let tileIndex = this.pokedexNumber - 1;
        // Increase offset because some pokemon... cough cough Pikachu and Venusaur are annoying.
        doubledSpritesPokedexNumbers.forEach(num =>
        {
            if (this.pokedexNumber > num)
                tileIndex++;
        });


        // Double to account for double sprites in spriteSheet
        tileIndex *= 2;
        let pokemonColumn = tileIndex % COLS_IN_SPRITESHEET;

        // Check the row
        let pokemonRow = Math.floor(tileIndex / COLS_IN_SPRITESHEET) * 4;

        this.directionalSprites = [
            [
                new Sprite(images.get(this.shiny ? ImageName.ShinyPokemon : ImageName.Pokemon), pokemonColumn * SpriteSheetTile.Size, pokemonRow * SpriteSheetTile.Size, SpriteSheetTile.Size, SpriteSheetTile.Size),
                new Sprite(images.get(this.shiny ? ImageName.ShinyPokemon : ImageName.Pokemon), (pokemonColumn + 1) * SpriteSheetTile.Size, pokemonRow * SpriteSheetTile.Size, SpriteSheetTile.Size, SpriteSheetTile.Size)
            ],
            [
                new Sprite(images.get(this.shiny ? ImageName.ShinyPokemon : ImageName.Pokemon), (pokemonColumn) * SpriteSheetTile.Size, (pokemonRow + 1) * SpriteSheetTile.Size, SpriteSheetTile.Size, SpriteSheetTile.Size),
                new Sprite(images.get(this.shiny ? ImageName.ShinyPokemon : ImageName.Pokemon), (pokemonColumn + 1) * SpriteSheetTile.Size, (pokemonRow + 1) * SpriteSheetTile.Size, SpriteSheetTile.Size, SpriteSheetTile.Size)
            ],
            [
                new Sprite(images.get(this.shiny ? ImageName.ShinyPokemon : ImageName.Pokemon), (pokemonColumn) * SpriteSheetTile.Size, (pokemonRow + 2) * SpriteSheetTile.Size, SpriteSheetTile.Size, SpriteSheetTile.Size),
                new Sprite(images.get(this.shiny ? ImageName.ShinyPokemon : ImageName.Pokemon), (pokemonColumn + 1) * SpriteSheetTile.Size, (pokemonRow + 2) * SpriteSheetTile.Size, SpriteSheetTile.Size, SpriteSheetTile.Size)
            ],
            [
                new Sprite(images.get(this.shiny ? ImageName.ShinyPokemon : ImageName.Pokemon), (pokemonColumn) * SpriteSheetTile.Size, (pokemonRow + 2) * SpriteSheetTile.Size, SpriteSheetTile.Size, SpriteSheetTile.Size),
                new Sprite(images.get(this.shiny ? ImageName.ShinyPokemon : ImageName.Pokemon), (pokemonColumn + 1) * SpriteSheetTile.Size, (pokemonRow + 2) * SpriteSheetTile.Size, SpriteSheetTile.Size, SpriteSheetTile.Size)
            ]

        ];

    }

    /**
     * Calculates this pokemon's stats for the current level.
     * https://www.dragonflycave.com/mechanics/stats
     */
    calculateStats()
    {
        this.baseStats.forEach((baseStat, index) =>
        {
            if (index == Stat.HP) return;
            this.stats[index] = Math.floor((2 * baseStat + this.ivs[index]) * this.pokemonLevel / 100 + 5);
        });
        this.calculateMaxHP();

    }

    /**
     * https://www.dragonflycave.com/mechanics/stats
     * @returns The pokemon's hp for the current level.
     */
    calculateMaxHP()
    {
        this.stats[Stat.HP] = Math.floor((2 * this.baseStats[Stat.HP] + this.ivs[Stat.HP]) * this.pokemonLevel / 100 + this.pokemonLevel + 10);
        this.maxHealth = this.stats[Stat.HP];
    }

    pickup()
    {
        sounds.play(SoundName.PickUp);
        this.pickedUp = true;
    }

    place()
    {
        sounds.play(SoundName.PutDown);
        this.pickedUp = false;
    }

    /**
     * Displays the indicator for how far this pokemon can attack.
     */
    renderRangeIndicator()
    {
        context.save();
        context.fillStyle = "rgba(0, 0, 0, 0.25)";
        context.beginPath();
        context.arc(this.position.x - this.renderOffset.x, this.position.y - this.renderOffset.y / 3, this.attackRange * Tile.SIZE, 0, 2 * Math.PI);
        context.fill();
        context.restore();
    }

    lowHealth()
    {
        return this.currentHealth / this.stats[Stat.HP] <= CATCHABLE_HEALTH_PERCENTAGE;
    }

    canLevelUp()
    {
        return this.experience >= this.nextLevelExperience;
    }

    canEvolve()
    {
        return this.evolutionLevel && this.canLevelUp() && this.evolutionLevel >= this.pokemonLevel + 1;
    }

    levelUpPrice()
    {
        return Math.pow(this.pokemonLevel, 2);
    }

    experiencePercentageToNextLevel()
    {
        return (this.experience - this.currentLevelBaselineExperience()) / (this.nextLevelExperience - this.currentLevelBaselineExperience());
    }

    levelUp(currentState)
    {
        if (this.pokemonLevel == 100)
            throw Error("Pokemon can not level up above level 100.");


        sounds.play(SoundName.LevelUp);
        this.pokemonLevel++;
        let evolving = false;
        if (this.evolutionLevel && this.evolutionLevel <= this.pokemonLevel)
        {
            evolving = true;
            this.evolve(currentState);
        }
        this.calculateStats();
        this.calculateNextLevelExperience();

        // Check if the pokemon learns a move at this level.
        // Only do it if not evolving since it gets done through the Evolve state otherwise
        if (!evolving)
        {
            this.learnThisLevelMoves();
        }

    }

    learnThisLevelMoves(){
        const newMoves = POKEMON_DATA.filter(pokemon => pokemon.no == this.pokedexNumber)[0].level_up_moves.filter(move => move.level == this.pokemonLevel);
            if (newMoves.length > 0)
            {

                let nextStateCallback = () => {}
                let currentMoveState = null
                for (let i = newMoves.length-1; i >= 0; i--){

                    // Skip not found moves
                    const newMove = AttackFactory.createAttack(newMoves[i].name);
                    if(!newMove)
                        continue

                    // Ignore if the new move was already learned at a different evolution stage
                    if (this.attacks.filter(attack => attack.name == newMove.name).length > 0)
                        continue

                    currentMoveState = new LearnMoveState(this, newMove, nextStateCallback);
                    nextStateCallback = () => stateStack.push(moveLearnState);
                }

                // Only push the first learn move state if a move was successfully found.
                if(currentMoveState)
                    stateStack.push(currentMoveState);
                
            }
    }

    calculateNextLevelExperience()
    {
        // Medium Slow https://bulbapedia.bulbagarden.net/wiki/Experience
        this.nextLevelExperience = this.currentLevelBaselineExperience(this.pokemonLevel + 1);
    }

    currentLevelBaselineExperience(level = this.pokemonLevel)
    {
        return Math.ceil(Math.pow(level, 3.1));
    }

    /**
     * Returns the experience that has been gained during this level.
     * For example, at level 2, a pokemon with 14 experience withh return 6 from this method.
     */
    calculateExperienceGainedThisLevel()
    {
        return this.experience - this.currentLevelBaselineExperience();
    }

    /**
     * Returns the experience that has to be gained during this level to level up.
     * For example, at level 2, a pokemon with 14 experience withh return 13 from this
     *  method since they have to reach 27 experience.
     */
    targetExperienceThisLevel()
    {
        return this.nextLevelExperience - this.currentLevelBaselineExperience();
    }

    evolve(currentState)
    {
        const nextStage = PokemonFactory.createPokemon(this.nextStagePokemon, this.pokemonLevel);
        currentState.removeEventListeners();
        stateStack.push(new EvolvingState(this, nextStage, () =>
        {
            this.learnThisLevelMoves();
        })
        );
    }

}