import Colour from "../enums/Colour.js";
import Tile from "../services/Tile.js";
import { CATCHABLE_HEALTH_PERCENTAGE } from "../globals.js";
import Panel from "./Panel.js";

export default class HealthBar extends Panel{

    static HEIGHT = 3 / Tile.SIZE;

    /**
     * A health bar to hover over wild pokemon.
     * @param {Pokemon} pokemon The pokemon associated with this health
     * @param {*} options 
     */
    constructor(pokemon, options = {}){
        super(0, 0, 0, HealthBar.HEIGHT, options);
        this.pokemon = pokemon;
    }

    update(dt){
        const pokemonHealthPercentage = this.pokemon.getHealthPercentage();
        this.position.y = this.pokemon.position.y - HealthBar.HEIGHT * Tile.SIZE * 3;
        this.dimensions.x = this.pokemon.dimensions.x * pokemonHealthPercentage;
        this.position.x = this.pokemon.position.x + (this.pokemon.dimensions.x / 2) * (1-pokemonHealthPercentage);

        if ((this.pokemon.lowHealth() && !this.pokemon.isBoss) || this.pokemon.shiny){
            this.panelColour = Colour.Crimson;
        }
        else if (pokemonHealthPercentage <= 0.6 && !this.pokemon.isBoss){
            this.panelColour = Colour.Gold;
        }
    }

}