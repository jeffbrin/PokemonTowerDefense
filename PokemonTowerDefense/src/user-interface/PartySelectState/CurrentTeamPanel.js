import Colour from "../../enums/Colour.js";
import Tile from "../../services/Tile.js";
import Panel from "../Panel.js";
import PartySelectPokemonBox from "./PartySelectPokemonBox.js";

export default class CurrentTeamPanel extends Panel
{
    static CURRENT_TEAM_PANEL_Y = (Panel.CURRENT_TEAM_IN_POKEMON_SELECT.height - 2) / 2;
    static GAP = (Panel.LEVELS_MENU.width - 2 * 6) / 8;
    constructor(partyPokemon, backgroundColor, borderColour)
    {
        super(Panel.CURRENT_TEAM_IN_POKEMON_SELECT.x,
            Panel.CURRENT_TEAM_IN_POKEMON_SELECT.y,
            Panel.CURRENT_TEAM_IN_POKEMON_SELECT.width,
            Panel.CURRENT_TEAM_IN_POKEMON_SELECT.height, { panelColour: backgroundColor, borderColour: borderColour, borderWidth: 5 }
        );
        this.partyPokemon = partyPokemon;
        this.pokemonBoxes = [];
        for (let i = 0; i < 6; i++)
        {
            const paddingTotal = (i + 1.5) * CurrentTeamPanel.GAP;
            const pokemonWidthTotal = (i * PartySelectPokemonBox.DIMENSIONS.width);
            if (this.partyPokemon.length > i)
                this.pokemonBoxes.push(new PartySelectPokemonBox(
                    this.position.x / Tile.SIZE + paddingTotal + pokemonWidthTotal,
                    this.position.y / Tile.SIZE + CurrentTeamPanel.CURRENT_TEAM_PANEL_Y,
                    partyPokemon[i],
                    Colour.White,
                    PartySelectPokemonBox.FULL_COLOUR
                ));
            else
                this.pokemonBoxes.push(new PartySelectPokemonBox(
                    this.position.x / Tile.SIZE + paddingTotal + pokemonWidthTotal,
                    this.position.y / Tile.SIZE + CurrentTeamPanel.CURRENT_TEAM_PANEL_Y,
                    null,
                    Colour.White,
                    PartySelectPokemonBox.EMPTY_COLOUR));
        }
    }

    update(dt){
        this.pokemonBoxes.forEach(box => box.update(dt));
    }

    render()
    {
        super.render();
        this.pokemonBoxes.forEach(box => box.render());
    }
}