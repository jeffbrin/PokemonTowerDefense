import GameObject from './GameObject.js';
import Sprite from '../../lib/Sprite.js';
import { context, images, timer } from '../globals.js';
import ImageName from '../enums/ImageName.js';
import Graphic from '../../lib/Graphic.js';
import Images from '../../lib/Images.js';
export default class CutScenePerson extends GameObject
{
    static OAK_SIZE = {
        x: 281,
        y: 559
    };
    static POKEMON_SIZE = {
        x: 120,
        y: 120
    };
    constructor(position, dimensions, imageName)
    {
        super(position, dimensions);

        this.image = images.get(imageName);
        this.startPosition = this.position;
        this.isHovering = false;
        this.isTweening = false;
        this.rotation = 0;
    }

    render()
    {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180);
        this.image.render(0, 0, this.dimensions.x, this.dimensions.y);
        context.restore();
    }
    onHover()
    {
        if (this.isHovering && !this.isTweening)
        {
            this.isTweening = true;
            timer.tween(this.image, ['opacity'], [0], 0.5, () => this.tweenAgain());
        }
    }
    onNoHover()
    {
        this.isHovering = false;
    }
    tweenAgain()
    {
        this.image.opacity === 0 ? timer.tween(this.image, ['opacity'], [1], 0.5, () => { if (this.isHovering) this.tweenAgain(); else this.isTweening = false; }) : timer.tween(this.image, ['opacity'], [0], 0.5, () => { if (this.isHovering) this.tweenAgain(); else { this.isTweening = false; this.image.opacity = 1; } });
    }
}