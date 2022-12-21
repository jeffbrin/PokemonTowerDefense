import { distanceBetween } from "../../../../lib/MathHelper.js";
import State from "../../StateThatSaves.js";
import PokemonTower from "../../../entities/PokemonTower.js";
import Tile from "../../../services/Tile.js"
import PokemonTowerAttackState from "./PokemonTowerAttackState.js";

export default class PokemonTowerIdleState extends State{
    /**
     * Creates a PokemonTowerIdleState
     * @param {PokemonTower} pokemonTower The pokemon tower associated with this state.
     */
    constructor(pokemonTower){
        super();
        this.pokemonTower = pokemonTower;
    }

    update(dt){
        this.pokemonTower.pokemon.update(dt);
        this.manageAttacks();
    }

    render(){
        this.pokemonTower.pokemon.render();
    }

    manageAttacks(){
        if(this.pokemonTower.pokemon.coolingDown || this.pokemonTower.pokemon.attacking || this.pokemonTower.pokemon.pickedUp)
            return;

        // TODO: Give different targeting types for now, order by who's closest to returning home.
        const pokemonInRange = this.pokemonTower.level.runningPokemon.filter(runner => distanceBetween(this.pokemonTower.pokemon.position, runner.position) <= PokemonTower.DEFAULT_RANGE * Tile.SIZE);
        pokemonInRange.sort((a, b) => {

            // Return the one closest to getting back to the start
            if(a.walkingForwards != b.walkingForwards){
                if (!a.walkingForwards)
                    return -1
                else
                    return 1
            }

            // If both are walking the same direction, get the one with the further next position
            if (a.nextPositionIndex != b.nextPositionIndex)
                return !a.walkingForwards ? a.nextPositionIndex - b.nextPositionIndex : b.nextPositionIndex - a.nextPositionIndex;

            // If they're headed for the same position, see which is farther
            
            // Walking down
            if(a.velocity.y < 0)
                return a.position.y - b.position.y
            // Walking up
            if(a.velocity.y > 0)
                return b.position.y - a.position.y
            // Walking Left
            if(a.velocity.x > 0)
                return b.position.x - a.position.x
            // Walking Right
            else
                return a.position.x - b.position.x
        })

        if(pokemonInRange.length > 0)
            this.pokemonTower.stateStack.push(new PokemonTowerAttackState(this.pokemonTower, pokemonInRange[0]));
    }
}