import Colour from "../../enums/Colour.js";
import Tile from "../../services/Tile.js";
import Panel from "../Panel.js";
import PartySelectPokemonBox from "./PartySelectPokemonBox.js";


export default class BoxParty extends Panel
{
    static BOX_PANEL_Y = (Panel.BOX_PANEL_POKEMON_SELECT.height - 2) / 2;
    static GAP = (Panel.LEVELS_MENU.width - 2 * 6) / 8;
    constructor(boxPokemon)
    {
        super(Panel.BOX_PANEL_POKEMON_SELECT.x,
            Panel.BOX_PANEL_POKEMON_SELECT.y,
            Panel.BOX_PANEL_POKEMON_SELECT.width,
            Panel.BOX_PANEL_POKEMON_SELECT.height,
            { panelColour: Colour.DarkGrey, borderColour: Colour.LightBlue, borderWidth: 5 }
        );
        this.boxPokemon = boxPokemon;
        this.pokemonBoxes = [];
        this.nextAreEmpty = false;
        const verticalPadding = 0.7;

        for (let r = 0; r < 3; r++)
        {
            for (let c = 0; c < 6; c++)
            {
                const paddingTotal = (c + 1.5) * BoxParty.GAP;
                const pokemonWidthTotal = (c * PartySelectPokemonBox.DIMENSIONS.width);
                if (this.boxPokemon.length > c && !this.nextAreEmpty)
                    this.pokemonBoxes.push(new PartySelectPokemonBox(
                        this.position.x / Tile.SIZE + paddingTotal + pokemonWidthTotal,
                        (this.position.y / Tile.SIZE) + (r * (this.position.y / Tile.SIZE) / 3) + verticalPadding,
                        this.boxPokemon[c % 6 + r * 6],
                        Colour.White,
                        PartySelectPokemonBox.FULL_COLOUR
                    ));
                else
                {
                    this.pokemonBoxes.push(new PartySelectPokemonBox(
                        this.position.x / Tile.SIZE + paddingTotal + pokemonWidthTotal,
                        this.position.y / Tile.SIZE + verticalPadding + (r * (this.position.y / Tile.SIZE) / 3),
                        null,
                        Colour.White, PartySelectPokemonBox.EMPTY_COLOUR
                    ));
                    this.nextAreEmpty = true;
                }
            }
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