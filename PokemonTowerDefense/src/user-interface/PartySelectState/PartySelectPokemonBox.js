import Timer from "../../../lib/Timer.js";
import Vector from "../../../lib/Vector.js";
import Colour from "../../enums/Colour.js";
import FontName from "../../enums/FontName.js";
import { context } from "../../globals.js";
import Inventory from "../../objects/Inventory.js";
import Tile from "../../services/Tile.js";
import Panel from "../Panel.js";
import PartyMemberHolder from "../PlayState/PartyMemberHolder.js";

export default class PartySelectPokemonBox extends Panel
{
    static DIMENSIONS = { width: 2, height: 2 };
    static EMPTY_COLOUR = Colour.Crimson;
    static FULL_COLOUR = Colour.Chartreuse;

    constructor(x, y, pokemon, panelColour, borderColour)
    {
        super(x, y, PartySelectPokemonBox.DIMENSIONS.width, PartySelectPokemonBox.DIMENSIONS.height, { panelColour: panelColour ?? Colour.White, borderWidth: 5, borderColour: borderColour ?? Colour.White });
        this.normalPanelColour = this.panelColour;
        this.emptyBorderColour = PartySelectPokemonBox.EMPTY_COLOUR;
        this.fullBorderColour = PartySelectPokemonBox.FULL_COLOUR;
        this.pokemon = pokemon;
        this.fontWeight = 'bold';
        this.fontSize = 10;
        this.fontFamily = FontName.PokemonGB;
        this.timeSinceColorToggle = 0;
    }

    update(dt){


        if(!this.pokemon || !this.pokemon.canLevelUp() || Inventory.getInstance().pokedollars < this.pokemon.levelUpPrice()){
            this.panelColour = this.normalPanelColour;
            return;
        }

        this.timeSinceColorToggle += dt;
        if(this.timeSinceColorToggle > 0.5){
            this.toggleBackgroundColour();
        }
    }

    render()
    {
        this.pokemon ? this.borderColour = this.fullBorderColour : this.borderColour = this.emptyBorderColour;
        super.render();

        //draw pokemon
        if (this.pokemon)
        {
            this.pokemon.pickedUp ? this.pokemon.render() : this.pokemon.render(new Vector(this.position.x + this.dimensions.x / 4, this.position.y + this.dimensions.y / 8));

            context.save();

            context.textBaseline = "top"
            context.textAlign = 'center';
            context.font = `${ this.fontWeight } ${ this.fontSize }px ${ this.fontFamily }`;
            context.fillStyle = Colour.Black;

            context.fillText(`${ this.pokemon.pokemonLevel }`, (this.position.x + this.dimensions.x / 2), this.position.y + this.dimensions.y / 1.5);

            context.restore();
        }


    }

    toggleBackgroundColour(){
        this.timeSinceColorToggle = 0;
        this.panelColour = this.panelColour == Colour.Crimson ? this.normalPanelColour : Colour.Crimson;
    }

}