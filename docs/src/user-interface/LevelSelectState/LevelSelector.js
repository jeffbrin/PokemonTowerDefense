import { roundedRectangle } from '../../../lib/DrawingHelpers.js';
import Tile from '../../services/Tile.js';
import Panel from '../Panel.js';
import UserInterfaceElement from '../UserInterfaceElement.js';
import Colour from './../../enums/Colour.js';
import { context, timer } from './../../globals.js';
import LevelBox from './LevelBox.js';
import LevelSelectLevelsPanel from './LevelSelectLevelsPanel.js';

export default class LevelSelector extends UserInterfaceElement
{

    static NUMBER_OF_LEVEL_CHOICES = 4;
    static isSelectorTweening = true;

    constructor(x, y, width, height, offset)
    {
        // super(2.5, 9.25, LevelBox.DIMENSIONS.width + 0.5, LevelBox.DIMENSIONS.height + 0.5);
        super(x - offset / 2, y - offset / 2, width + offset, height + offset);
        this.colour = { r: 255, g: 255, b: 255, a: 1 };
        this.borderWidth = 3;
        this.isVisible = false;
        this.offset = offset * Tile.SIZE;

        // timer.tween(this.colour, ['a'], [0], 0.5, () => LevelSelector.isSelectorTweening = !LevelSelector.isSelectorTweening);
        timer.tween(this.colour, ['a'], [0], 0.5, () => this.tweenAgain());

    }

    render()
    {
        if (!this.isVisible) return;
        context.save();
        context.strokeStyle = `rgba(${ this.colour.r }, ${ this.colour.g }, ${ this.colour.b }, ${ this.colour.a })`;
        context.lineWidth = this.borderWidth;
        context.beginPath();
        context.roundRect(this.position.x, this.position.y, this.dimensions.x, this.dimensions.y, 5);
        context.closePath();
        context.stroke();
        context.restore();
    }
    update()
    {
        //if mouse over then isVisible is true
        //switch on the 4 positions

    }
    tweenAgain()
    {
        this.colour.a === 0 ? timer.tween(this.colour, ['a'], [1], 0.5, () => this.tweenAgain()) : timer.tween(this.colour, ['a'], [0], 0.5, () => this.tweenAgain());
    }

    onHover(x, y)
    {
        this.position.x = x - this.offset / 2;
        this.position.y = y - this.offset / 2;
        this.isVisible = true;
    }
    onNoHover()
    {
        this.isVisible = false;
    }
}
