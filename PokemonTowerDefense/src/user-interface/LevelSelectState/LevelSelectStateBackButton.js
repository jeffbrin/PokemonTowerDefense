import Button from "../Button.js";

export default class LevelSelectStateBackButton extends Button
{
    static BUTTON_PLACEMENT = { x: 0.25, y: 0.25, width: 3, height: 1.5 };
    constructor(text)
    {
        super(LevelSelectStateBackButton.BUTTON_PLACEMENT.x, LevelSelectStateBackButton.BUTTON_PLACEMENT.y, LevelSelectStateBackButton.BUTTON_PLACEMENT.width, LevelSelectStateBackButton.BUTTON_PLACEMENT.height, text);
    }
    
    
}