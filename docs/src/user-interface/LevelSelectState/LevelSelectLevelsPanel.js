import Colour from "../../enums/Colour.js";
import Tile from "../../services/Tile.js";
import Panel from "../Panel.js";
import LevelBox from "./LevelBox.js";
import LevelSelector from "./LevelSelector.js";

export default class LevelSelectLevelsPanel extends Panel
{
    static LEVEL_PANEL_Y = (Panel.LEVELS_MENU.height - 4) / 2;
    static GAP = (Panel.LEVELS_MENU.width - 3 * 5) / 7;
    //                          3 per box * Number of boxes  / Number of boxes +2

    constructor(levels)
    {
        super(Panel.LEVELS_MENU.x, Panel.LEVELS_MENU.y, Panel.LEVELS_MENU.width, Panel.LEVELS_MENU.height, { borderWidth: 5, panelColour: "rgba(0, 0, 0, 0.4)", borderColour: Colour.Gold, panelColour: Colour.Crimson });
        this.levels = levels;
        this.levelBoxes = [];
        this.selector = new LevelSelector(
            Panel.DEFAULT_LEVEL_SELECTOR_LOCATION.x,
            Panel.DEFAULT_LEVEL_SELECTOR_LOCATION.y,
            Panel.DEFAULT_LEVEL_SELECTOR_LOCATION.width,
            Panel.DEFAULT_LEVEL_SELECTOR_LOCATION.height,
            Panel.DEFAULT_LEVEL_SELECTOR_LOCATION.offset,
        );
        this.levels.forEach((level, i) => {
            const paddingTotal = (i + 1.5) * LevelSelectLevelsPanel.GAP;
            const levelsWidthTotal = (i * LevelBox.DIMENSIONS.width);
            this.levelBoxes.push(new LevelBox(this.position.x / Tile.SIZE + paddingTotal + levelsWidthTotal, this.position.y / Tile.SIZE + LevelSelectLevelsPanel.LEVEL_PANEL_Y, level));
            
        })
         
    }
    update(dt)
    {

    }

    render()
    {
        super.render();
        this.levelBoxes.forEach(holder => { holder.render(); });
        this.selector.render();
    }
    didMouseHitObject(x, y, object)
    {
        return x >= object.position.x
            && x <= object.position.x + object.dimensions.x
            && y >= object.position.y
            && y <= object.position.y + object.dimensions.y;
    }
}