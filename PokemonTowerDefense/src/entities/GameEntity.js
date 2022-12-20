import Hitbox from "../../lib/Hitbox.js";
import Vector from "../../lib/Vector.js";
import Animation from "../../lib/Animation.js";
import Colour from "../enums/Colour.js";
import { context, DEBUG } from "../globals.js";

export default class GameEntity{

    /**
     * Creates a game entity.
     * @param {Vector} position The position of the entity.
     * @param {Vector} dimensions The dimensions of the entity.
     * @param {Hitbox} hitboxOffsets The hitbox's offsets compared to the entity itself.
     * @param {Vector} renderOffset The render offset.
     * @param {Vector} velocity Optional - The starting velocity of the entity.
     */
    constructor(position, dimensions, hitboxOffsets = new Hitbox(), renderOffset = new Vector(0, 0), velocity = new Vector(0, 0)){
        this.position = position;
        this.dimensions = dimensions;
        this.hitboxOffsets = hitboxOffsets;
        this.velocity = velocity;
        this.hitbox = new Hitbox(
            this.position.x + this.hitboxOffsets.position.x,
            this.position.y + this.hitboxOffsets.position.y,
            this.dimensions.x + this.hitboxOffsets.dimensions.x,
            this.dimensions.y + this.hitboxOffsets.dimensions.y,
            Colour.Crimson
            )
        this.sprites = [];
        this.animation = new Animation([0], 0);
        this.renderOffset = renderOffset;
    }

    /**
     * Updates the entity.
     * @param {Number} dt Delta Time.
     */
    update(dt){
        this.hitbox.position.x = this.position.x + this.hitboxOffsets.position.x;
        this.hitbox.position.y = this.position.y + this.hitboxOffsets.position.y;
        this.dimensions.x + this.hitboxOffsets.dimensions.x;
        this.dimensions.y + this.hitboxOffsets.dimensions.y;

        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.animation.update(dt);
    }

    /**
     * Renders this game entity.
     */
    render(){
        this.sprites[this.animation.getCurrentFrame()].render(this.position.x + this.renderOffset.x, this.position.y + this.renderOffset.y);
        this.renderHitbox();
    }

    renderHitbox(){
        if(DEBUG)
            this.hitbox.render(context);
    }


    /**
     * Checks if this game entity collided with another.
     * @param {GameEntity} other The other game entity.
     * @returns True if this entity collided with the other. False otherwise.
     */
    didCollide(other){
        return this.hitbox.didCollide(other.hitbox)
    }

}