import Vector from "../../lib/Vector.js";
import Colour from "../enums/Colour.js";
import FontName from "../enums/FontName.js";
import SoundName from "../enums/SoundName.js";
import { context, sounds } from "../globals.js";
import Panel from "./Panel.js";

export default class Button extends Panel
{
    constructor(x, y, width, height, text)
    {
        super(x, y, width, height, { borderWidth: 3, panelColour: Colour.Crimson, borderColour: Colour.White });
        this.text = text;
        this.fontSize = 16;
        this.fontWeight = 'bold';
        this.fontFamily = FontName.Joystix;
        this.fontColour = this.borderColour;
        this.isHovering = false;
    }

    render()
    {
        if (!this.isVisible) return;
        if (this.isHovering) this.panelColour = Colour.LighterCrimson;
        else this.panelColour = Colour.Crimson;

        super.render();
        context.save();
        context.textBaseline = 'top';
        context.font = `${ this.fontWeight } ${ this.fontSize }px ${ this.fontFamily }`;
        context.fillStyle = this.fontColour;
        const lineDimensions = context.measureText(this.text);
        const textPosition = new Vector(this.position.x + this.dimensions.x / 2 - lineDimensions.width / 2, this.position.y + this.dimensions.y / 2 - this.fontSize / 2);
        context.fillText(this.text, textPosition.x, textPosition.y);
        context.restore();
    }

    onHover()
    {
        this.isHovering = true;
        this.borderColour = this.fontColour = Colour.Black;
    }
    onNoHover()
    {
        this.isHovering = false;
        this.borderColour = this.fontColour = Colour.White;
    }
    onPress()
    {
        sounds.play(SoundName.ButtonPress);
    }
}