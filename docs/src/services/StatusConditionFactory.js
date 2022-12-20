import PokemonStatusCondition from "../objects/PokemonStatusCondition.js";
import StatusConditionName from "../enums/StatusConditionName.js";
import Stat from "../enums/Stat.js";
import AttackType from "../enums/AttackType.js";


function attackTypeToColour(attackType)
{
    switch (attackType)
    {
        case AttackType.Psychic:
            return 'rgba(148, 0, 211, 0.5 )';
        case AttackType.Normal:
            return 'rgba(168, 168, 120, 0.5 )';
        case AttackType.Bug:
            return 'rgba(168, 184, 32, 0.5 )';
        case AttackType.Fighting:
            return 'rgba(192, 48, 40, 0.5 )';
        case AttackType.Flying:
            return 'rgba(168, 144, 240, 0.5 )';
        case AttackType.Poison:
            return 'rgba(160, 64, 160, 0.5 )';
        case AttackType.Ground:
            return 'rgba(224, 192, 104, 0.5 )';
        case AttackType.Rock:
            return 'rgba(184, 160, 56, 0.5 )';
        case AttackType.Ghost:
            return 'rgba(112, 88, 152, 0.5 )';
        case AttackType.Fire:
            return 'rgba(240, 128, 48, 0.5 )';
        case AttackType.Water:
            return 'rgba(104, 144, 240, 0.5 )';
        case AttackType.Grass:
            return 'rgba(120, 200, 80, 0.5 )';
        case AttackType.Electric:
            return 'rgba(248, 208, 48, 0.5 )';
        case AttackType.Ice:
            return 'rgba(150, 217, 214, 0.5 )';
        case AttackType.Dragon:
            return 'rgba(112, 56, 248, 0.5 )';
        case AttackType.Steel:
            return 'rgba(184, 184, 208, 0.5 )';
        case AttackType.Dark:
            return 'rgba(112, 88, 72, 0.5 )';
        case AttackType.Fairy:
            return 'rgba(112, 88, 72, 0.5 )';
        default:
            return 'rgba(0, g: 0, 0.5 )';
    }
}

export default class StatusConditionFactory{

    /**
     * Gets a pokemon status condition from its name.
     * @param {StatusConditionName} name The name of the status conditon.
     * @returns A PokemonStatusConditon
     */
    static getStatusCondition(name, pokemon, attack){
        switch(name){
            case StatusConditionName.Poisoned:
                return new PokemonStatusCondition(pokemon, (pokemon, severity) => {
                    pokemon.takeDamage(pokemon.maxHealth * severity / 16)
                },
                4000,
                StatusConditionName.Poisoned,
                1,
                3,
                attackTypeToColour(attack.type))

            // Only calculate on add and remove. Calculating every frame causes wild pokemon to not be able to change directions.
            // WildPokemon takes care of slowing down when slowed.
            case StatusConditionName.Slowed:
                return new PokemonStatusCondition(pokemon, (pokemon, severity) => {
                },
                4500,
                StatusConditionName.Slowed,
                0,
                3,
                attackTypeToColour(attack.type),
                (pokemon, severity) => {
                    pokemon.calculateNewVelocity();
                },
                (pokemon, severity) => {
                    pokemon.calculateNewVelocity();
                })
            // Only calculate on add and remove.
            // WildPokemon takes care of stopping when asleep.
            case StatusConditionName.Asleep:
                return new PokemonStatusCondition(pokemon, (pokemon, severity) => {
                },
                2000,
                StatusConditionName.Asleep,
                0,
                5,
                attackTypeToColour(attack.type),
                (pokemon, severity) => {
                    pokemon.calculateNewVelocity();
                },
                (pokemon, severity) => {
                    pokemon.calculateNewVelocity();
                })
        }
    }

} 