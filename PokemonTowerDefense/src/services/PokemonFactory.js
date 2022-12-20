import Vector from "../../lib/Vector.js";
import Pokemon from "../entities/Pokemon.js";
import { MOVES, POKEMON_DATA, SHINY_POKEMON_CHANCE } from "../globals.js";
import PokemonType from "../enums/PokemonType.js";
import AttackType from "../enums/AttackType.js";
import { didSucceedPercentChance, getRandomPositiveInteger, getRandomPositiveNumber } from "../../lib/RandomNumberHelpers.js";
import WildPokemon from "../entities/WildPokemon.js";
import PokedexNumber from "../enums/PokedexNumber.js";
import PokemonTower from "../entities/PokemonTower.js";
import Attack from "../objects/Attack.js";
import AttackFactory from "./AttackFactory.js";

export default class PokemonFactory
{
    
    static createPokemon(pokedexNumber, level, attacks = null){
        // Get this pokemon's data
        const pokemonData = POKEMON_DATA.filter(pd => pd.no == pokedexNumber)[0];

        // Generate random attacks
        let pokemonAttacks = []
        if (attacks == null){
            let possibleAttacks = pokemonData.level_up_moves.filter(m => m.level <= level);

            // Only include attacks that are in the global MOVES list. This is especially important now that we removed all status attacks
            possibleAttacks = possibleAttacks.filter(attack => MOVES.filter(move => move.name == attack.name.toLowerCase().replace(" ", "-")).length > 0)

            // Pokemon gets the first 4 moves by default, then every move after has a 75% chance of replacing a random attack.
            if (possibleAttacks.length <= 4)
                pokemonAttacks = possibleAttacks;
            else
                pokemonAttacks = possibleAttacks.slice(0, 4);

            // Random chance of newer attacks.
            for(let i = 4; i < possibleAttacks.length; i++){
                if(didSucceedPercentChance(0.8))
                    pokemonAttacks[getRandomPositiveInteger(0, 3)] = possibleAttacks[i];
            }

            pokemonAttacks = pokemonAttacks.map(a => 
                AttackFactory.createAttack(a.name)
            ).filter(attack => attack);
        }

        // Generate ivs and instantiate pokemon
        const ivs = []
        for (let i = 0; i < 6; i++){ivs.push(getRandomPositiveInteger(0, 31))}
        const pokemon = new Pokemon(
            pokedexNumber, 
            pokemonData["name"], 
            pokemonData["types"].map(PokemonFactory.typeStringToType), 
            pokemonData["base_stats"].slice(0, 6),
            ivs,
            level,
            pokemonAttacks,
            didSucceedPercentChance(SHINY_POKEMON_CHANCE),
            pokemonData['nextStage'],
            pokemonData['evolutionLevel']
        )

        return pokemon;
    }

    /**
     * Creates a wild pokemon.
     * @param {Pokemon} pokemon The pokemon to base this wild pokemon off of.
     * @param {PokedexNumber} pokedexNumber The pokedex number of the pokemon to generate.
     * @param {Number} pokemonLevel The level of the pokemon. 
     */
    static createWildPokemon(pokedexNumber = 0, pokemonLevel = 0, pokemon = null, isBoss = false){
        
        // Generate the pokemon if it doesn't exist.
        if(pokemon == null){
            if(pokedexNumber == 0 || pokemonLevel == 0)
                throw Error("Wild pokemon's pokedex number and level must both be set if no pokemon is passed to the createWildPokemon method.")
            pokemon = PokemonFactory.createPokemon(pokedexNumber, pokemonLevel);
        }

        return new WildPokemon(
            pokemon.pokedexNumber, 
            pokemon.name, 
            pokemon.types, 
            pokemon.baseStats, 
            pokemon.ivs, 
            pokemon.pokemonLevel, 
            pokemon.attacks, 
            didSucceedPercentChance(SHINY_POKEMON_CHANCE),
            pokemon.nextStagePokemon,
            pokemon.evolutionLevel,
            isBoss);
    }

    static createPokemonTower(towerSlot, level, pokemon = null, pokedexNumber = 0, pokemonLevel = 0){
        if(pokemon == null){
            if(pokedexNumber == 0 || level == 0)
                throw Error("Pokemon tower's pokedex number and level must both be set if no pokemon is passed to the createPokemonTower method.")
            pokemon = PokemonFactory.createPokemon(pokedexNumber, level);
        }

        return new PokemonTower(pokemon, towerSlot, level)
    }

    static typeStringToType(typeString){
        if(typeString.type)
            typeString = typeString.type.name
        switch(typeString.charAt(0).toUpperCase() + typeString.slice(1)){
            case AttackType.Normal:
                return PokemonType.Normal;
            case AttackType.Fighting:
                return PokemonType.Fighting;
            case AttackType.Flying:
                return PokemonType.Flying;
            case AttackType.Poison:
                return PokemonType.Poison;
            case AttackType.Ground:
                return PokemonType.Ground;
            case AttackType.Rock:
                return PokemonType.Rock;
            case AttackType.Bug:
                return PokemonType.Bug;
            case AttackType.Ghost:
                return PokemonType.Ghost;
            case AttackType.Fire:
                return PokemonType.Fire;
            case AttackType.Water:
                return PokemonType.Water;
            case AttackType.Grass:
                return PokemonType.Grass;
            case AttackType.Electric:
                return PokemonType.Electric;
            case AttackType.Psychic:
                return PokemonType.Psychic;
            case AttackType.Ice:
                return PokemonType.Ice;
            case AttackType.Dragon:
                return PokemonType.Dragon;
            case AttackType.Steel:
                return PokemonType.Steel;
            case AttackType.Dark:
                return PokemonType.Dark;
            case AttackType.Fairy:
                return PokemonType.Fairy;
        }
    }
}