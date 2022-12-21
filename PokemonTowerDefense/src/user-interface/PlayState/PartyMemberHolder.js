import Vector from "../../../lib/Vector.js";
import Pokemon from "../../entities/Pokemon.js";
import Panel from "../Panel.js";
import Tile from "../../services/Tile.js";
import { context, timer } from "../../globals.js";
import Colour from "../../enums/Colour.js";
import Textbox from "../Textbox.js";
import ExperienceIndicator from "./ExperienceIndicator.js";
import Inventory from "../../objects/Inventory.js";

export default class PartyMemberHolder extends Panel{
    static DIMENSIONS = {width: 1.25, height: 1.25};
    static POKEMON_RENDER_OFFSET = new Vector(-Tile.SIZE / 3, -Tile.SIZE * 5/4);
    static LEVEL_UP_INDICATION_COLOUR = Colour.Crimson;

    constructor(x, y, pokemon = null){
        super(x, y, PartyMemberHolder.DIMENSIONS.width, PartyMemberHolder.DIMENSIONS.height, {borderWidth: 2})
        this.addPokemon(pokemon);
        this.fontSize = 8;
        this.fontFamily = Textbox.FONT_FAMILY;
        this.defaultPanelColour = this.panelColour;
        this.experienceIndicatorPadding = 0;
        this.experienceIndicator = new ExperienceIndicator(
            (this.position.x) / Tile.SIZE, 
            (this.position.y + this.dimensions.y) / Tile.SIZE - 0.16, 
            (this.dimensions.x - this.experienceIndicatorPadding * 2) / Tile.SIZE,
            0.15,
            this);
        timer.addTask(() => this.flipLevelUpBackgroundColor(), 0.5);
    }

    update(dt){
        if(this.pokemon != null)
        {
            this.pokemon.update(dt);

            if(this.pokemonIsTower)
                super.nonLevelUpPanelColour = Colour.LightBlue;
            else
                super.nonLevelUpPanelColour = this.defaultPanelColour;

                this.experienceIndicator.update(dt);
        }
    }

    flipLevelUpBackgroundColor(){

        if(!this.pokemon)
            return;

        // Return if the pokemon can't level up.
        if (!this.pokemon.canLevelUp() || Inventory.getInstance().pokedollars < this.pokemon.levelUpPrice()){
            this.panelColour = this.nonLevelUpPanelColour
            return;
        }

        this.panelColour = this.panelColour == this.nonLevelUpPanelColour ? PartyMemberHolder.LEVEL_UP_INDICATION_COLOUR : this.nonLevelUpPanelColour;

    }

    render(){
        super.render();
        
        if(this.pokemon != null){
            // Render pokemon

            // Save the pokemon position, move it to this square, draw, then reset the position.
            // Important for when a pokemon is placed as a tower since it needs to render twice.
            this.pokemon.renderOffset = PartyMemberHolder.POKEMON_RENDER_OFFSET;

            // Render in black and white if it's placed
            context.save();

            const shouldOverridePosition = !this.pokemon.pickedUp || (this.pokemon.pickedUp && this.pokemonIsTower)
            this.pokemon.render(shouldOverridePosition ? this.position : null, this.pokemonIsTower);
            context.restore();

            this.pokemon.renderOffset = Pokemon.RENDER_OFFSET;

            // Render the experience bar
            this.experienceIndicator.render();

            // Render the pokemon level underneath
            context.save();
            context.textBaseline = "top";
            context.font = `${ this.fontSize }px ${ this.fontFamily }`;
		    context.fillStyle = Colour.Black;
            const text = this.pokemon.pokemonLevel;
            const lineWidth = context.measureText(text).width;
            context.fillText(text, this.position.x + Tile.SIZE / 2 - lineWidth / 2 + 2, this.position.y + Tile.SIZE * 0.6);
            context.restore();

        }
    }

    addPokemon(pokemon){
        this.pokemon = pokemon;

        if(this.pokemon != null)
            this.pokemon.position = new Vector(this.position.x, this.position.y);
    }

    retrievePokemonFromField(){
        this.pokemonIsTower = false;
        this.pokemon.position = new Vector(this.position.x, this.position.y);
    }
}