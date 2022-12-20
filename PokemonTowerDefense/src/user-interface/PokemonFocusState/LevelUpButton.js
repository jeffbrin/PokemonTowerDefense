import Colour from "../../enums/Colour.js";
import SoundName from "../../enums/SoundName.js";
import { context, pokedollarIcon, sounds } from "../../globals.js";
import Button from "../Button.js";

export default class LevelUpButton extends Button
{
    constructor(x, y, width, height, pokemon, inventory)
    {
        super(x, y, width, height, "Level Up");
        this.inventory = inventory;
        this.pokemon = pokemon;
        this.padding = 4;
    }

    onHover()
    {
        if (this.canLevelUp())
            super.onHover();
    }

    canLevelUp()
    {
        return this.inventory.pokedollars >= this.pokemon.levelUpPrice() && this.pokemon.canLevelUp();
    }

    render()
    {
        super.render();
        context.save();
        context.textBaseline = 'top';
        let fontSize = this.fontSize - 5;
        context.font = `${ this.fontWeight } ${ fontSize }px ${ this.fontFamily }`;
        context.fillStyle = this.fontColour;

        // Current level
        context.fillText(`Lvl. ${ this.pokemon.pokemonLevel }`, this.position.x + this.padding, this.position.y + this.padding);

        // Current experience and target experience
        const topPadding = fontSize;
        fontSize -= 3;
        context.font = `${ this.fontWeight } ${ fontSize }px ${ this.fontFamily }`;
        const currentExperienceThisLevel = this.pokemon.calculateExperienceGainedThisLevel();
        const targetExperienceThisLevel = this.pokemon.targetExperienceThisLevel();
        context.fillText(`Exp: ${ currentExperienceThisLevel } / ${ targetExperienceThisLevel }`, this.position.x + this.padding, this.position.y + this.padding + topPadding);

        // Pokedollars cost and balance
        fontSize = this.fontSize - 7;
        context.font = `${ this.fontWeight } ${ fontSize }px ${ this.fontFamily }`;
        context.fillText(`Cost: ${ pokedollarIcon }${ this.pokemon.levelUpPrice() }`, this.position.x + this.padding, this.position.y + this.padding + fontSize * 4.5);
        context.fillText(`Balance:${ pokedollarIcon }${ this.inventory.pokedollars }`, this.position.x + this.padding, this.position.y + this.padding + (fontSize * 5.5));

        context.restore();

    }

    update()
    {
        this.fontColour = this.canLevelUp() ? Colour.White : Colour.DarkGrey;
    }

    onClick(currentState)
    {
        if (this.canLevelUp())
        {
            sounds.play(SoundName.Purchase);
            this.inventory.pokedollars -= this.pokemon.levelUpPrice();
            this.pokemon.levelUp(currentState);
        }
    }
}