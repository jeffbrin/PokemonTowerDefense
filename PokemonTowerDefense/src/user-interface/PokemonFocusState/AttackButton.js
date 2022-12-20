import Colour from "../../enums/Colour.js";
import { context } from "../../globals.js";
import Panel from "../Panel.js";

export default class AttackButton extends Panel{

    static SELECTED_COLOUR = "orange";
    static UNSELECTED_COLOUR = Colour.Black;

    constructor(x, y, width, height, attack, pokemon){
        super(x, y, width, height, {
            panelColour: pokemon.selectedAttack == attack ? AttackButton.SELECTED_COLOUR : AttackButton.UNSELECTED_COLOUR, 
            borderColour: Colour.White, 
            borderWidth: 2}
            );
        this.attack = attack;
        this.pokemon = pokemon;

        this.fontSize = Panel.FONT_SIZE-1;
		this.fontColour = Colour.White;
		this.fontFamily = Panel.FONT_FAMILY;
    }

    onClick(){
        this.pokemon.selectedAttack = this.attack;
        this.panelColour = AttackButton.SELECTED_COLOUR;
    }

    render(){
        super.render();
        context.save();

        context.textBaseline = 'top';
		context.font = `${ this.fontSize }px ${ this.fontFamily }`;
		context.fillStyle = this.fontColour;
        const lineWidth = context.measureText(this.attack.name).width;
        const marginToCenter = (this.dimensions.x - lineWidth) / 2
        context.fillText(this.attack.name, this.position.x + marginToCenter, this.position.y + this.fontSize);
        context.restore();
    }

}