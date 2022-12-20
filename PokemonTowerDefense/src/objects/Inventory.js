import Pokemon from "../entities/Pokemon.js";
import SoundName from "../enums/SoundName.js";
import { sounds } from "../globals.js";

export default class Inventory
{

    static instance;
    static GET_INSTANCE_CALLED = false;

    constructor(party = [], box = [], pokedollars = 0)
    {

        if (!Inventory.GET_INSTANCE_CALLED)
            throw Error("Do no call Inventory constructor directly");

        this.party = party;
        this.box = box;
        this.pokedollars = pokedollars;
        this.pokeballCount = 1;
        Inventory.GET_INSTANCE_CALLED = false;
    }

    static getInstance()
    {

        if (!Inventory.instance)
        {
            Inventory.GET_INSTANCE_CALLED = true;
            Inventory.instance = new Inventory();
        }
        return Inventory.instance;
    }

    /**
     * Catches a pokemon from the wild.
     * @param {WildPokemon} wildPokemon The wild pokemon caught.
     * @returns The pokemon added to the party / box.
     */
    catch(wildPokemon)
    {
        // Add to the party if possible, otherwise add to the box.
        sounds.play(SoundName.CaughtPokemon);
        const caughtPokemon = new Pokemon(wildPokemon.pokedexNumber, wildPokemon.name, wildPokemon.types, wildPokemon.stats, wildPokemon.ivs, wildPokemon.pokemonLevel, wildPokemon.attacks, wildPokemon.shiny, wildPokemon.nextStagePokemon, wildPokemon.evolutionLevel);
        if (this.party.length < 6)
        {
            this.party.push(caughtPokemon);
        }
        else
        {
            this.box.push(caughtPokemon);
        }

        return caughtPokemon;

    }
}