import { normalize } from "../../lib/MathHelper.js";
import { didSucceedPercentChance, getRandomPositiveInteger, getRandomPositiveNumber } from "../../lib/RandomNumberHelpers.js";
import Vector from "../../lib/Vector.js";
import Colour from "../enums/Colour.js";
import Direction from "../enums/Direction.js";
import SpriteSheetTile from "../enums/SpriteSheetTile.js";
import Stat from "../enums/Stat.js";
import StatusConditionName from "../enums/StatusConditionName.js";
import { context, criticalHitChance } from "../globals.js";
import Level from "../objects/Level.js";
import StatusConditionFactory from "../services/StatusConditionFactory.js";
import Tile from "../services/Tile.js";
import HealthBar from "../user-interface/HealthBar.js";
import Panel from "../user-interface/Panel.js";
import Pokemon from "./Pokemon.js";
import WildPokemonDamageText from "./WildPokemonDamageText.js";
export default class WildPokemon extends Pokemon
{

    /**
     * Initializes a wild pokemon which will try to steal rare candies.
     * @param {Level} level The level this pokemon exists on.
     * @param {Number} pokedexNumber The pokedex number of this pokemon.
     * @param {PokemonName} name The pokemon's name 
     * @param {Array} types The pokemon's type(s). 
     * @param {Array} baseStats Base stats.
     * @param {Array} ivs IVs.
     * @param {Number} pokemonLevel The pokemon's level. 
     * @param {Array} attacks This pokemon's attacks. 
     * @param {PokemonName} nextStagePokemon The name of the pokemon that this pokemon evolves into. 
     */
    constructor(pokedexNumber,
        name, types, baseStats, ivs, pokemonLevel, attacks = [], shiny = false, nextStagePokemon = null, evolutionLevel = null, isBoss = false)
    {

        super(pokedexNumber,                           // Don't allow bosses to be shiny because it's cruel
            name, types, baseStats, ivs, pokemonLevel, attacks, (shiny && !isBoss), nextStagePokemon, evolutionLevel);

        this.nextPositionIndex = 1;
        this.rareCandy = null;
        this.walkingForwards = true;
        this.currentHealth = this.stats[Stat.HP];

        this.healthBar = new HealthBar(this, { panelColour: isBoss ? Colour.DodgerBlue : Colour.Chartreuse, borderColour: "black", padding: 0, borderWidth: 0 });
        this.attackedBy = [];
        this.damageTexts = [];
        this.isBoss = isBoss;

        this.statusConditions = []
        this.currentStats = this.stats.map(stat => stat);

    }

    moveToNextPosition(snapToLastPosition = true)
    {
        // Turn backwards if reached the end, 
        if (this.nextPositionIndex == this.targetPositions.length - 1)
        {
            this.walkingForwards = false;
        }
        else if (this.nextPositionIndex == 0 && !this.walkingForwards)
        {
            this.walkingForwards = true;

            // Successfully steal the rare candy and drop it.
            if (this.rareCandy)
            {
                this.rareCandy.stolen = true;
                this.dropRareCandy();
            }
        }

        // Set the next position to move towards.
        // Set to previous position first, so the movement is straight.
        if (snapToLastPosition)
            this.position = new Vector(this.targetPositions[this.nextPositionIndex].x, this.targetPositions[this.nextPositionIndex].y);

        if (this.walkingForwards)
        {
            this.nextPositionIndex++;
        }
        else
        {
            this.nextPositionIndex--;
        }

        this.calculateNewVelocity();
        this.changeDirection();

    }

    update(dt)
    {
        super.update(dt);
        this.healthBar.update(dt);
        const removedConditions = []
        this.statusConditions = this.statusConditions.filter(condition => 
                {
                    if (condition.isExpired()){
                        removedConditions.push(condition)
                        return false;
                    }
                    return true;
                }
            );
        removedConditions.forEach(condition => condition.remove());

        this.statusConditions.forEach(condition => condition.update(dt));

        const targetPosition = this.targetPositions[this.nextPositionIndex];
        // Moving Right
        if (this.velocity.x > 0 && this.position.x > targetPosition.x)
        {
            this.moveToNextPosition();
        }
        // Moving Down
        if (this.velocity.y > 0 && this.position.y > targetPosition.y)
        {
            this.moveToNextPosition();
        }
        // Moving Left
        if (this.velocity.x < 0 && this.position.x < targetPosition.x)
        {
            this.moveToNextPosition();
        }
        // Moving Up
        if (this.velocity.y < 0 && this.position.y < targetPosition.y)
        {
            this.moveToNextPosition();
        }

        // Filter out the damage texts
        this.damageTexts = this.damageTexts.filter(text => !text.cleanup);

        // Check for collisions with a rare candy
        if (!this.rareCandy)
        {
            this.level.rareCandies.forEach(candy =>
            {
                // Return if we picked up a candy
                if (this.rareCandy)
                    return;

                // Check if we collided with a candy and it hasn't been picked up
                if (this.didCollide(candy) && !candy.pickedUp && !candy.stolen)
                {
                    this.pickupRareCandy(candy);
                }
            });
        }


        if (this.rareCandy)
        {
            this.rareCandy.position = new Vector(this.position.x, this.position.y - Tile.SIZE / 2);
        }
    }

    getCaught()
    {
        this.dropRareCandy();

    }

    render()
    {
        if (this.isDead())
            return;
        this.statusConditions.forEach(condition => condition.render());
        super.render();
        this.healthBar.render();
        this.damageTexts.forEach(text => text.render());
        
    }

    pickupRareCandy(candy)
    {
        candy.pickedUp = true;
        this.rareCandy = candy;

        const wasWalkingForwards = this.walkingForwards;
        this.walkingForwards = false;

        if (wasWalkingForwards)
            this.moveToNextPosition(false);
    }

    dropRareCandy()
    {
        if (this.rareCandy == null)
            return;
        this.rareCandy.drop();
        // Place it back on the path
        this.rareCandy.position = new Vector(this.position.x, this.position.y);
        if (isNaN(this.rareCandy.position.x) || isNaN(this.rareCandy.position.y))
            debugger;
        this.rareCandy = null;
    }

    die()
    {
        this.level.inventory.pokedollars += this.calculateCurrencyToProvide();
        this.attackedBy.forEach(attacker =>
        {
            attacker.experience += Math.ceil(this.calculateExperienceToProvide() / this.attackedBy.length);
        });
        this.dropRareCandy();
    }

    isDead()
    {
        return this.currentHealth <= 0 || (isNaN(this.position.x) || isNaN(this.position.y));
    }

    calculateNewVelocity()
    {
        const velX = this.targetPositions[this.nextPositionIndex].x - this.position.x;
        const velY = this.targetPositions[this.nextPositionIndex].y - this.position.y;

        // If slowed
        let speedMultiplier = 1;
        const slowedCondition = this.statusConditions.filter(condition => condition.name == StatusConditionName.Slowed);
        if (slowedCondition.length > 0)
            speedMultiplier = speedMultiplier / (slowedCondition[0].severity + 1);

        // If asleep
        // Set speed multiplier to 1 / max speed stat. That way, currentspeed will be set to 1.
        // When we do velocity = ln(speed) * 10, the ln(speed) will be 0 since ln(1) = 0.
        const asleepCondition = this.statusConditions.filter(condition => condition.name == StatusConditionName.Asleep);
        if (asleepCondition.length > 0)
            speedMultiplier = 1 / this.stats[Stat.Speed];


        this.currentStats[Stat.Speed] = this.stats[Stat.Speed] * speedMultiplier;

        this.velocity = normalize(new Vector(velX, velY));
        this.velocity.x *= Math.log2(this.currentStats[Stat.Speed]) * 10;
        this.velocity.y *= Math.log2(this.currentStats[Stat.Speed]) * 10;
    }

    changeDirection()
    {
        if (this.velocity.x > 0)
            this.direction = Direction.RIGHT;
        if (this.velocity.x < 0)
            this.direction = Direction.LEFT;
        if (this.velocity.y > 0)
            this.direction = Direction.DOWN;
        if (this.velocity.y < 0)
            this.direction = Direction.UP;
    }

    getHealth()
    {
        return this.currentHealth;
    }

    getHealthPercentage()
    {
        return this.currentHealth / this.stats[Stat.HP];
    }

    setLevel(level)
    {
        this.level = level;
        this.stage = level.map;
        this.targetPositions = level.map.getPathPoints();
        this.position = new Vector(this.targetPositions[0].x, this.targetPositions[0].y);
        this.calculateNewVelocity();
        this.changeDirection();
    }

    getAttacked(attack, attacker)
    {

        if (!this.attackedBy.includes(attacker.pokemon))
            this.attackedBy.push(attacker.pokemon);

        // No status attack functionality for now.
        if (attack.damageClass == 'status'){
            this.applyCondition(attack.statusConditionName, attack);
            return;
        }

        const criticalMultiplier = didSucceedPercentChance(criticalHitChance) ? 1.5 : 1;
        const attackStat = attack.damageClass == 'special' ? attacker.pokemon.stats[Stat.SPAttack] : attacker.pokemon.stats[Stat.Attack];
        const defenseStat = attack.damageClass == 'special' ? this.stats[Stat.SPDefense] : this.stats[Stat.Defense];
        const stabMultipler = attacker.isStabAttack(attack) ? 1.5 : 1;
        let typeMultiplier = 1;
        this.types.forEach(type =>
        {
            if (type.weakTo(attack.type))
                typeMultiplier *= 2;
            else if (type.resistantTo(attack.type))
                typeMultiplier /= 2;
            else if (type.immuneTo(attack.type))
                typeMultiplier = 0;
        });

        let damage = Math.ceil((((((2 * attacker.pokemon.pokemonLevel * criticalMultiplier) / 5 + 2) * attack.power * attackStat / defenseStat) / 50) + 2) * stabMultipler * typeMultiplier * getRandomPositiveInteger(217, 255) / 255);
        this.currentHealth -= damage;

        // Display damage
        this.addToDamageTexts(damage, typeMultiplier);
    }

    /**
     * Applies a new or more severe status condition.
     * @param {StatusCondition} newCondition A status condition.
     */
    applyCondition(newCondition, attack){
        const matchingConditions = this.statusConditions.filter(condition => condition.name == newCondition);

        // Increase the severity of existing conditions if they exist, otherwise push a new one.
        if(matchingConditions.length > 0)
            matchingConditions[0].increaseSeverity();
        else{
            const addedCondition = StatusConditionFactory.getStatusCondition(newCondition, this, attack);
            this.statusConditions.push(addedCondition);
            addedCondition.add()
        }
    }

    takeDamage(damage){

        damage = Math.ceil(damage);
        this.currentHealth -= damage;
        // Display damage
        this.addToDamageTexts(damage, 1);
    }

    /**
     * Renders a number to indicate how much damage was taken.
     * @param {Number} damage The quantity of damage to display.
     */
    addToDamageTexts(damage, effectiveness)
    {
        let colour;
        switch (effectiveness)
        {
            case 4:
                colour = "rgb(255,215,0)";
                break;
            case 2:
                colour = "rgb(255, 100, 0)";
                break;
            case 1:
                colour = "rgb(170, 40, 3)";
                break;
            case 1 / 2:
                colour = "rgb(90, 30, 2)";
                break;
            case 1 / 4:
                colour = "rgb(50, 20, 1)";
                break;
            case 0:
                colour = "rgba(0, 0, 0)";
                break;
        }

        this.damageTexts.push(new WildPokemonDamageText(this.position, damage, colour));
    }

    calculateExperienceToProvide()
    {
        // 142 should really be the base exp provided by the attacking pokemon
        // Changed divisor from 7 to 15
        return Math.ceil(142 * this.pokemonLevel / 15);
    }

    calculateCurrencyToProvide()
    {
        return Math.ceil(this.pokemonLevel * getRandomPositiveNumber(1.5, 2.5));
    }

} 