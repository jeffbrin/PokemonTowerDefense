import Pokemon from "../entities/Pokemon.js";
import PokedexNumber from "../enums/PokedexNumber.js";
import { getHighestUnlockedLevel, getUsername, pokemonFactory, setHighestUnlockedLevel, setUsername } from "../globals.js"
import Inventory from "../objects/Inventory.js";
import AttackFactory from "./AttackFactory.js";
import PokemonFactory from "./PokemonFactory.js";
const saveItemKey = "ptd-save-data";
const saveBackupKey = "ptd-backup-save-data";

export const save = () => {
    const inventory = Inventory.getInstance();
    localStorage.setItem(
        saveItemKey, 
        JSON.stringify({
            level: getHighestUnlockedLevel(),
            party: inventory.party,
            box: inventory.box,
            pokedollars: inventory.pokedollars,
            username: getUsername(),
            pokeballCount: inventory.pokeballCount
        }));
    
}

/**
 * Loads data and returns the inventory.
 * @returns Inventory
 */
export const loadData = () => {
    let data;
    try{
        data = JSON.parse(localStorage.getItem(saveItemKey));
    }
    catch(e){
        wipeData(localStorage.getItem(saveItemKey));
    }
    const dataString = localStorage.getItem(saveItemKey);
    if(!data)
        return Inventory.getInstance();
        
    try{
        setUsername(data.username);
        setHighestUnlockedLevel(data.level);
        const box = data.box.map(pokemon => loadedDataToPokemon(pokemon))
        const party = data.party.map(pokemon => loadedDataToPokemon(pokemon))
        const instance = Inventory.getInstance();
        instance.party = party;
        instance.box = box;
        instance.pokedollars = data.pokedollars;
        instance.pokeballCount = data.pokeballCount;

        // Check if the data is invalid, wipe the save and notify
        if(!getUsername() || (instance.party.length == 0 && instance.box.length == 0)){
            wipeData(dataString);
        }
    }
    catch(e){
        wipeData(dataString);
    }

    return 
}

function wipeData(dataString){
    
    localStorage.setItem(saveBackupKey, dataString);

    alert("Your save data was corrupted. The good news is we backed it up for you. Just don't clear your browsing history, and contact a developer so we can help you recover it.");
    alert("The page will now refresh and appear as if you've never played the game before. !! IF YOU CONTINUE PLAYING AND YOUR DATA IS CORRUPTED AGAIN, YOU WILL LOSE YOUR OLD ACCOUNT FOREVER !!")

    localStorage.setItem(
        saveItemKey,
        null
    )
    location.reload();
}

function loadedDataToPokemon(pokemonData){

    // Parse attacks
    pokemonData.attacks = pokemonData.attacks.map(attack => AttackFactory.createAttack(attack.name));
    // Parse types
    pokemonData.types = pokemonData.types.map(type => PokemonFactory.typeStringToType(type.name));

    const pokemon = new Pokemon(pokemonData.pokedexNumber, pokemonData.name, pokemonData.types, pokemonData.baseStats, pokemonData.ivs, pokemonData.pokemonLevel, pokemonData.attacks, pokemonData.shiny ?? false, pokemonData.nextStagePokemon, pokemonData.evolutionLevel)
    pokemon.selectedAttack = pokemon.attacks.filter(attack => attack.name == pokemonData.selectedAttack.name)[0];
    pokemon.experience = pokemonData.experience;
    return pokemon;
}

