import { getRandomNegativeNumber, getRandomNumber, getRandomPositiveInteger, getRandomPositiveNumber } from "../../lib/RandomNumberHelpers.js";
import Vector from "../../lib/Vector.js";
import { context, timer } from "../globals.js";
import Tile from "../services/Tile.js";

export default class WildPokemonDamageText {
    constructor(pokemonPosition, text, colour){
        this.position = pokemonPosition;
        this.text = text;
        this.colour = colour;
        this.fontSize = 20;
        this.fontFamily = "PokemonGB";
        this.offset = new Vector(0, -Tile.SIZE * 0.75);
        timer.tween(this, ["fontSize"], [0], 0.5, () => {this.cleanup = true});
    }

    render(){
        context.save();
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.fillStyle = this.colour;
        const textWidth = context.measureText(this.text).width
        context.fillText(this.text, this.position.x + Tile.SIZE / 2 - textWidth / 2 , this.position.y + this.offset.y)
        context.restore();
    }

    
}