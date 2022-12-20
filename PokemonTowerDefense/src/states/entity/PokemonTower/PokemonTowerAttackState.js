import State from "../../StateThatSaves.js";
import Vector from "../../../../lib/Vector.js";
import ParticleSystem from "../../../entities/particlesystems/ParticleSystem.js";
import PokemonTower from "../../../entities/PokemonTower.js";
import AttackType from "../../../enums/AttackType.js";
import Colour from "../../../enums/Colour.js";
import SoundName from "../../../enums/SoundName.js";
import { sounds, stateStack, timer } from "../../../globals.js";
import Tile from "../../../services/Tile.js";
import Sounds from "../../../../lib/Sounds.js";
import Timer from "../../../../lib/Timer.js";
import { didSucceedPercentChance } from "../../../../lib/RandomNumberHelpers.js";

export default class PokemonTowerAttackState extends State
{
    /**
     * Created a pokemon tower attack state.
     * @param {PokemonTower} pokemonTower The attacking pokemon tower.
     * @param {WildPokemon} targetPokemon The pokemon being attacked.
     */
    constructor(pokemonTower, targetPokemon)
    {
        super();
        this.pokemonTower = pokemonTower;
        this.targetPokemon = targetPokemon;
        this.timer = new Timer();
    }

    render()
    {
        if (this.attackParticleSystem)
            this.attackParticleSystem.render();
    }

    update(dt)
    {

        this.timer.update(dt);

        if (this.attackParticleSystem)
            this.attackParticleSystem.update(dt);

        if (this.doneAttacking)
            this.pokemonTower.stateStack.pop();
    }

    enter()
    {
        this.attack(this.targetPokemon);
    }

    exit()
    {
        this.pokemonTower.attacking = false;
    }

    attack(target)
    {
        let movementTime = 0.25;
        this.pokemonTower.attacking = true;


        const selectedAttack = this.pokemonTower.pokemon.selectedAttack;
        if(selectedAttack.priority){
            cooldownTime /= 1.25;
            movementTime /= 1.1;
        }

        // Tween to and from target if physical attack
        if (selectedAttack.damageClass == "physical")
        {
            this.timer.tween(this.pokemonTower.pokemon.position, ['x', 'y'], [target.position.x, target.position.y], movementTime, () =>
            {
                if(didSucceedPercentChance(selectedAttack.accuracy / 100))
                    target.getAttacked(selectedAttack, this.pokemonTower);

                this.playAttackSound(selectedAttack.name, SoundName.DefaultPhysicalAttackNoise)
                this.timer.tween(this.pokemonTower.pokemon.position, ['x', 'y'], [this.pokemonTower.towerSlot.position.x, this.pokemonTower.towerSlot.position.y], movementTime, () =>
                {
                    this.pokemonTower.cooldown(selectedAttack.cooldown);

                    // Set to null so update pops the statestack.
                    this.doneAttacking = true;
                }
                );
            });
        }
        // Particle system for special attacks.
        else if (selectedAttack.damageClass == "special")
        {
            this.attackParticleSystem = new ParticleSystem(new Vector(this.pokemonTower.pokemon.position.x + Tile.SIZE / 2, this.pokemonTower.pokemon.position.y + Tile.SIZE / 2), 5, this.attackTypeToColour(selectedAttack.type), 150, 300, null, false, target);
            this.playAttackSound(selectedAttack.name, SoundName.DefaultSpecialAttackNoise);
            this.timer.addTask(() => { }, 0, movementTime * 2, () =>
            {
                if(didSucceedPercentChance(selectedAttack.accuracy / 100))
                    target.getAttacked(selectedAttack, this.pokemonTower);
                this.pokemonTower.cooldown(selectedAttack.cooldown);

                // Set to null so update pops the statestack.
                this.doneAttacking = true;
            });
        }
        else if (selectedAttack.damageClass == "status")
        {
            if(didSucceedPercentChance(selectedAttack.accuracy / 100))
                selectedAttack.attack(this.pokemonTower, target)
            this.doneAttacking = true;
            this.pokemonTower.cooldown(selectedAttack.cooldown);
            this.playAttackSound(selectedAttack.name, SoundName.DefaultStatusAttackNoise);
        }
    }

    // Try to play the selected attack, use tackle if the sound can't be found
    playAttackSound(name, fallbackOption){
        // Try to play the selected attack, use tackle if the sound can't be found
        try{
            sounds.play(name.toLowerCase().replace(" ", "-"));
        }
        catch(e){
            if (e instanceof TypeError){
                console.log("Could not find " + name.toLowerCase().replace(" ", "-"));
                sounds.play(fallbackOption);
            }
        }
    }

    attackTypeToColour(attackType)
    {
        switch (attackType)
        {
            case AttackType.Psychic:
                return { r: 148, g: 0, b: 211, a: 1 };
            case AttackType.Normal:
                return { r: 168, g: 168, b: 120, a: 1 };
            case AttackType.Bug:
                return { r: 168, g: 184, b: 32, a: 1 };
            case AttackType.Fighting:
                return { r: 192, g: 48, b: 40, a: 1 };
            case AttackType.Flying:
                return { r: 168, g: 144, b: 240, a: 1 };
            case AttackType.Poison:
                return { r: 160, g: 64, b: 160, a: 1 };
            case AttackType.Ground:
                return { r: 224, g: 192, b: 104, a: 1 };
            case AttackType.Rock:
                return { r: 184, g: 160, b: 56, a: 1 };
            case AttackType.Ghost:
                return { r: 112, g: 88, b: 152, a: 1 };
            case AttackType.Fire:
                return { r: 240, g: 128, b: 48, a: 1 };
            case AttackType.Water:
                return { r: 104, g: 144, b: 240, a: 1 };
            case AttackType.Grass:
                return { r: 120, g: 200, b: 80, a: 1 };
            case AttackType.Electric:
                return { r: 248, g: 208, b: 48, a: 1 };
            case AttackType.Ice:
                return { r: 150, g: 217, b: 214, a: 1 };
            case AttackType.Dragon:
                return { r: 112, g: 56, b: 248, a: 1 };
            case AttackType.Steel:
                return { r: 184, g: 184, b: 208, a: 1 };
            case AttackType.Dark:
                return { r: 112, g: 88, b: 72, a: 1 };
            case AttackType.Fairy:
                return { r: 112, g: 88, b: 72, a: 1 };
            default:
                return { r: 0, g: 0, b: 0, a: 1 };
        }
    }
}