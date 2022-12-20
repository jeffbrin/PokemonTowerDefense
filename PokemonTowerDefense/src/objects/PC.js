
export default class PC{
    static MAX_CAPACITY = 500;
    constructor(pokemon = []){
        if(this.pokemonList.length > PC.MAX_CAPACITY)
            this.pokemonList = pokemon.splice(0, PC.MAX_CAPACITY);
        else
            this.pokemonList = pokemon;
    }

    releasePokemon(pokemon){
        this.pokemonList.splice(this.pokemonList.indexOf(pokemon), 1);
    }
}