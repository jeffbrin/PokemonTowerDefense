import Colour from "../../enums/Colour.js";
import { canvas, context, keys, timer } from "../../globals.js";
import Tile from "../../services/Tile.js";
import Panel from "../../user-interface/Panel.js";

export default class InputBox extends Panel{

    static ALPHA_TOGGLE_DELAY = 0.4;

    constructor(x, y, width, height, maxNameLength, tooLongNameCallback){
        super(x, y, width, height, {borderWidth: 2, borderColour: Colour.Crimson, panelColour: Colour.Black});

        this.cursorIndicatorColour = {r: 255, g: 255, b: 255, a: 1}
        this.cursorIndicator = new Panel(x + 0.1, y + 0.15, 0.1, this.dimensions.y / Tile.SIZE - 0.3, {borderWidth: 0, borderColour: Colour.Transparent, panelColour: Colour.White});
        this.timeSinceAlphaToggle = 0;

        this.playerInput = "";
        this.fontSize = Panel.FONT_SIZE;
		this.fontColour = Colour.White;
		this.fontFamily = Panel.FONT_FAMILY;
        this.maxNameLength = maxNameLength;
        this.tooLongNameCallback = tooLongNameCallback;
    }

    update(dt){

        // If any key has been pressed, set it to false and add it to the input text.
        Object.keys(keys).forEach(key => {
            if (!keys[key])
                return;

            const charCode = key.charCodeAt(0);

            // Characters
            if(key == "Backspace"){
                if(!this.playerInput)
                    return;

                let indexToDeleteFrom = this.playerInput.length-1;
                if(keys["Control"])
                {
                    const split_words = this.playerInput.split(" ");
                    indexToDeleteFrom = Math.max(0, indexToDeleteFrom - split_words[split_words.length-1].length)
                }
                this.playerInput = this.playerInput.slice(0, indexToDeleteFrom);
                keys[key] = false;
            }
            else if (this.playerInput.length == this.maxNameLength){
                this.tooLongNameCallback();
            }
            else if(key.length == 1 && charCode >= 65 && charCode <= 122){
                this.playerInput += key;
                keys[key] = false;
            }
            else if(key == " "){
                this.playerInput += " ";
                keys[key] = false;
            }
        });

        this.timeSinceAlphaToggle += dt;
        if(this.timeSinceAlphaToggle >= InputBox.ALPHA_TOGGLE_DELAY)
            this.toggleCursorIndicator();
    }

    render(){
        super.render()
        context.save();
        this.renderText();
        this.renderCursorIndicator();
        context.restore();
    }


    toggleCursorIndicator(){
        this.timeSinceAlphaToggle = 0;
        this.cursorIndicatorColour.a = this.cursorIndicatorColour.a ? 0 : 1
        this.cursorIndicator.panelColour = `rgba(${this.cursorIndicatorColour.r}, ${this.cursorIndicatorColour.g}, ${this.cursorIndicatorColour.b}, ${this.cursorIndicatorColour.a})`;
    }

    renderText()
	{
		context.textBaseline = 'top';
		context.font = `${ this.fontSize }px ${ this.fontFamily }`;
		context.fillStyle = this.fontColour;

        context.fillText(this.playerInput.slice(Math.max(this.playerInput.length - 15, 0)), this.position.x + 0.25 * Tile.SIZE, this.position.y + 0.45 * Tile.SIZE);
    }

    renderCursorIndicator(){
        const cursorIndicatorOffset = context.measureText(this.playerInput).width;
        this.cursorIndicator.position.x = Math.min(this.position.x + 0.25 * Tile.SIZE + cursorIndicatorOffset, this.position.x + this.dimensions.x - 0.15 * Tile.SIZE);
        this.cursorIndicator.render();
    }

}