import Panel from "../Panel.js";

export default class ImagePanel extends Panel
{
    constructor(x, y, width, height, image = null, options = {})
    {
        super(x, y, width, height, options);
        this.sprite = image;

    }
    render()
    {
        super.render();
    }
}