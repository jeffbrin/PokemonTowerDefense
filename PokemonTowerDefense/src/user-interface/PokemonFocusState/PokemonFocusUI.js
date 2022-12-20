import Colour from "../../enums/Colour.js";
import Inventory from "../../objects/Inventory.js";
import Tile from "../../services/Tile.js";
import Panel from "../Panel.js";
import Textbox from "../Textbox.js";
import AttackDescriptionPanel from "./AttackDescriptionPanel.js";
import AttacksPanel from "./AttacksPanel.js";
import Button from "../Button.js";
import LevelUpButton from "./LevelUpButton.js";
import PokemonDetailsPanel from "./PokemonDetailsPanel.js";

export default class PokemonFocusUI
{

    static CLOSE_BUTTON = { x: 15.75, y: 14.75, width: 3, height: 1.75 };

    /**
     * Creates a pokemon focus ui element which displays details about the selected pokemon.
     * Also allows the user to change things about the pokemon like the selected attack.
     * @param {Pokemon} pokemon The pokemon being focused on.
     * @param {Inventory} inventory The inventory of the player.
     */
    constructor(pokemon, inventory, allowRelease = false)
    {
        this.pokemon = pokemon;
        this.inventory = inventory;
        this.backBottomPanel = new Panel(
            Panel.POKEMON_FOCUS_BOTTOM.x, Panel.POKEMON_FOCUS_BOTTOM.y, Panel.POKEMON_FOCUS_BOTTOM.width, Panel.POKEMON_FOCUS_BOTTOM.height,
            { panelColour: "rgba(0, 0, 0, 0.75)", borderColour: Colour.Transparent, borderWidth: 0 });
        this.attacksPanel = new AttacksPanel(this.pokemon);
        this.attackDescriptionPanel = new AttackDescriptionPanel(pokemon);
        this.closeButton = new Button(PokemonFocusUI.CLOSE_BUTTON.x, PokemonFocusUI.CLOSE_BUTTON.y, PokemonFocusUI.CLOSE_BUTTON.width, PokemonFocusUI.CLOSE_BUTTON.height, "Done");
        this.levelUpButton = new LevelUpButton(Panel.POKEMON_FOCUS_BOTTOM.x + Panel.POKEMON_FOCUS_BOTTOM.width - 5, Panel.POKEMON_FOCUS_BOTTOM.y - 4, 5, 4, pokemon, this.inventory);
        this.pokemonDetailsPanel = new PokemonDetailsPanel(this.pokemon);
        this.releasePokemonButton = new Button(4, 10, 4, 1.5, "Release");
        this.allowRelease = allowRelease;
    }

    update(dt)
    {
        this.levelUpButton.update(dt);
        this.attacksPanel.update(dt);
    }

    render()
    {
        this.backBottomPanel.render();
        this.attacksPanel.render();
        this.attackDescriptionPanel.render();
        this.closeButton.render();
        this.levelUpButton.render();
        this.pokemonDetailsPanel.render();
        if (this.allowRelease)
            this.releasePokemonButton.render();
    }
}