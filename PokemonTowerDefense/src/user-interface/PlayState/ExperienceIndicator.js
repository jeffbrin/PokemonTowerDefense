import Colour from "../../enums/Colour.js";
import Panel from "../Panel.js";

export default class ExperienceIndicator extends Panel{
    constructor(x, y, width, height, pokemonPartyMemberHolder){
        super(x, y, width, height, {panelColour: Colour.DarkerDodgerBlue, borderColour: Colour.Black, borderWidth: 0});
        this.pokemonPartyMemberHolder = pokemonPartyMemberHolder;
        this.maxWidth = this.dimensions.x;
    }

    update(dt){
        if(this.pokemonPartyMemberHolder.pokemon)
            this.dimensions.x = Math.min(this.maxWidth, this.maxWidth * this.pokemonPartyMemberHolder.pokemon.experiencePercentageToNextLevel())
    }
}