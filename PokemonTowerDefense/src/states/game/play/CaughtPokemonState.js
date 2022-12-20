import StateThatSaves from "../../StateThatSaves.js";
import Vector from "../../../../lib/Vector.js";
import Colour from "../../../enums/Colour.js";
import { CANVAS_WIDTH, stateStack, timer } from "../../../globals.js";
import Tile from "../../../services/Tile.js";
import Panel from "../../../user-interface/Panel.js";
import Textbox from "../../../user-interface/Textbox.js";
import Inventory from "../../../objects/Inventory.js";

export default class CaughtPokemonState extends StateThatSaves{
    
    constructor(caughtPokemon, callback = () => {}){
        super();

        this.caughtPokemon = caughtPokemon;
        const caughtPokemonText = this.generateCaughtPokemonText(caughtPokemon);

        const placement = Panel.CAUGHT_POKEMON;
        this.textbox = new Textbox(
            -placement.width,
            placement.y + placement.height-2,
            placement.width,
            2,
            caughtPokemonText,
            { fontColour: Colour.White, isAdvanceable: true, panelColour: Colour.Transparent, borderWidth: 5, borderColour: Colour.Transparent },
            true
        );
        this.panel = new Panel(
            -placement.width,
            placement.y,
            placement.width,
            placement.height,
            {panelColour: "rgba(0, 0, 0, 0.5)", borderWidth: 5} 
        )
        this.callback = callback;

        // Tween the elements in.
        timer.tween(this.textbox.position, ['x'], [placement.x * Tile.SIZE], 0.5);
        timer.tween(this.panel.position, ['x'], [placement.x * Tile.SIZE], 0.5);
    }

    enter()
    {
        // sounds.play(SoundName.CaughtPokemon);
        Inventory.getInstance().pokeballCount--;
    }

    update(dt)
    {
        this.textbox.update(dt);
        this.caughtPokemon.position = new Vector(this.panel.position.x + this.panel.dimensions.x / 2 - Tile.SIZE / 2, this.panel.position.y + Tile.SIZE * 2)
        this.caughtPokemon.update(dt);

        if (this.textbox.isClosed && !this.transitioningOut)
        {
            // Tween the elements out.
            this.transitioningOut = true;
            timer.tween(this.textbox.position, ['x'], [CANVAS_WIDTH], 0.5);
            timer.tween(this.panel.position, ['x'], [CANVAS_WIDTH], 0.5, () => {
                stateStack.pop()
            });
        }
    }

    render()
    {
        this.panel.render();
        this.textbox.render();
        this.caughtPokemon.render();
    }

    generateCaughtPokemonText(pokemon){
        return `${pokemon.name} level ${pokemon.pokemonLevel}!`;
    }
}