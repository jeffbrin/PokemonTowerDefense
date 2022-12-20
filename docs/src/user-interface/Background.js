import Vector from "../../lib/Vector.js";
import Colour from "../enums/Colour.js";
import { canvas, context } from "../globals.js";
import UserInterfaceElement from "./UserInterfaceElement.js";

/**
 * Basic Background
 */
export default class Background extends UserInterfaceElement
{
    constructor(colour = Colour.DarkGrey, position = new Vector(0, 0), dimensions = new Vector(canvas.width, canvas.height))
    {
        super(position.x, position.y, dimensions.x, dimensions.y);
        this.colour = colour;
        this.opacity = 1;
    }
    render()
    {
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = this.colour;
        context.fillRect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);
        context.restore();
    }
}