import ImageName from "../../enums/ImageName.js";
import Tile from "../../services/Tile.js";
import { canvas, CANVAS_HEIGHT, context, getHighestUnlockedLevel, images } from "../../globals.js";
import UserInterfaceElement from "../UserInterfaceElement.js";
import LevelSelectLevelsPanel from "./LevelSelectLevelsPanel.js";
import Panel from "../Panel.js";
import Colour from "../../enums/Colour.js";
import Vector from "../../../lib/Vector.js";
import Textbox from "../Textbox.js";

export default class LevelBox extends Panel {
    static DIMENSIONS = { width: 3, height: 3 };
    constructor(x, y, level) {
        super(x, y, LevelBox.DIMENSIONS.width, LevelBox.DIMENSIONS.height, { borderWidth: 5, borderColour: level.borderColour, panelColour: Colour.DarkGrey });
        this.image = images.get(level.imageName);
        this.colour = level.borderColour;
        this.levelName = level.name;

        this.fontSize = 6;
        this.font = `${this.fontSize}px ${Textbox.FONT_FAMILY}`
        this.locked = level.levelNumber > getHighestUnlockedLevel();

        this.lockedIndicator = new Panel(x - 0.1, y, LevelBox.DIMENSIONS.width + 0.2, LevelBox.DIMENSIONS.height, {borderWidth: 0, borderColour: Colour.Transparent, panelColour: "rgba(0, 0, 0, 0.9)"});
    }
    render() {
        super.render();
        context.save();

        context.strokeStyle = this.colour;
        context.strokeRect(this.position.x - 1, this.position.y - 1, this.dimensions.x + 2, this.dimensions.y + 2);


        // Render name
        context.fillStyle = Colour.White;
        context.font = this.font;
        context.textBaseline = "top";

        this.levelName.split(' ').forEach((text, index) => {
            const textWidth = context.measureText(text).width;
            context.fillText(text, this.position.x + this.dimensions.x / 2 - textWidth / 2, this.position.y + this.dimensions.y + 12 + this.fontSize * index)
        })

        context.restore();
        this.image.render(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y);

        // Blackout if locked
        if(this.locked)
            this.lockedIndicator.render();
    }

}