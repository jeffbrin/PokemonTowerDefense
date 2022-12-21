import Colour from "../../../enums/Colour.js";
import { canvas, CANVAS_WIDTH, context, stateStack } from "../../../globals.js";
import Inventory from "../../../objects/Inventory.js";
import Tile from "../../../services/Tile.js";
import Panel from "../../../user-interface/Panel.js";
import Textbox from "../../../user-interface/Textbox.js";
import StateThatSaves from "../../StateThatSaves.js";

export class ShinyPokemonAppearedState extends StateThatSaves{
    constructor(){
        super();
        this.panel = new Panel(0, Panel.MIDDLE_DIALOGUE.y, CANVAS_WIDTH / Tile.SIZE, Panel.MIDDLE_DIALOGUE.height, {panelColour: Colour.Black, borderWidth: 0});
        this.fontSize = Textbox.FONT_SIZE+2;
        this.fontFamily = Textbox.FONT_FAMILY;
        this.textColour = Colour.White;

        this.mouseDownListener = (e) => this.handleMouseDown(e);
        this.attachEventListeners();
    }

    enter(){
        const inventory = Inventory.getInstance();
        if (inventory.pokeballCount == 0){
            inventory.pokeballCount = 1;
            this.pokeballGiven = true;
        }
    }

    attachEventListeners(){
        super.attachEventListeners();
        canvas.addEventListener("mousedown", this.mouseDownListener);
    }

    removeEventListeners(){
        super.removeEventListeners();
        canvas.removeEventListener("mousedown", this.mouseDownListener);
    }

    render(){
        this.panel.render();

        context.save();
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.fillStyle = this.textColour;

        let text = "A shiny pokemon has appeared!"
        let xOffset = this.panel.dimensions.x / 2 - context.measureText (text).width / 2
        context.fillText(text, this.panel.position.x + xOffset, this.panel.position.y + this.panel.dimensions.y / 2 - this.fontSize / 2)
        
        // If a pokeball has been given to the player, let them know
        if (this.pokeballGiven){
            context.font = `${this.fontSize-2}px ${this.fontFamily}`;
            text = "Good thing you just found a pokeball."
            xOffset = this.panel.dimensions.x / 2 - context.measureText (text).width / 2
            context.fillText(text, this.panel.position.x + xOffset, this.panel.position.y + this.panel.dimensions.y / 2 + this.fontSize)
        }
        
        context.restore();
    }

    handleMouseDown(e){
        stateStack.pop();
    }

}