import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import GameEntity from "./GameEntity.js";

export default class RareCandy extends GameEntity{
    constructor(position, dimensions){
        super(position, dimensions);
        this.sprites = this.getSprites();
        this.currentFrame = 0;
        this.stolen = false;
        this.pickedUp = false;
    }

    getSprites(){
        return [
            new Sprite(images.get(ImageName.RareCandy), 0, 0, 16, 16)
        ];
    }

    pickup(){
        this.pickedUp = true;
    }

    drop(){
        this.pickedUp = false;
    }

    
}