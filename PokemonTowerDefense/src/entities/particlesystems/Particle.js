import { normalize } from "../../../lib/MathHelper.js";
import Vector from "../../../lib/Vector.js";
import { context } from "../../globals.js";

export default class Particle{
    constructor(position, radius, target, speed, colour = {r: 0, g: 0, b: 0, a: 1}, transparentDropoff = false){
        this.position = position;
        this.colour = colour;
        this.radius = radius;
        this.target = target;
        this.speed = speed;
    }

    update(dt){

        const direction = normalize(new Vector(this.target.x - this.position.x, this.target.y - this.position.y))
        this.position.x += direction.x * this.speed * dt;
        this.position.y += direction.y * this.speed * dt;
    }

    render(){

        // Render circle if no sprite is provided
        context.save()
        context.fillStyle = `rgba(${this.colour.r}, ${this.colour.g}, ${this.colour.b}, ${this.colour.a})`
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.fill();
        context.restore()
    }
}