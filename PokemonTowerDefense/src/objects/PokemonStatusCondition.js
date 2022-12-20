import Timer from "../../lib/Timer.js";
import Colour from "../enums/Colour.js";
import { context } from "../globals.js";
import Tile from "../services/Tile.js";

export default class PokemonStatusCondition{

    constructor(pokemon, doStatusConditionEffect, duration, name, delay, maxSeverity = 1, colour = Colour.Black, remove = () => {}, add = () => {}, icon = null){
        this.pokemon = pokemon;
        this.doStatusConditionEffect = doStatusConditionEffect;
        this.duration = duration;
        this.lifetime = 0;
        this.name = name;
        this.severity = 1;
        this.maxSeverity = maxSeverity;
        this.delay = delay;
        this.colour = colour;

        /**
         * Called when added, when severity is increased, or when severity is decreased
         */
        this.add = () => {
            add(this.pokemon, this.severity);
        }

        this.remove = () => {
            remove(this.pokemon); 
            this.removed.wasRemoved = true
        };
        this.removed = {wasRemoved: false};

        this.timer = new Timer();
        this.timer.addTask(
            () => {
                if(!this.removed.wasRemoved)
                    doStatusConditionEffect(this.pokemon, this.severity)
                else
                    debugger
            },
            this.delay
            )

        // Reduce the severity after the duratiion
        setTimeout(() => {
            this.severity--;
        }, this.duration);
    }

    // Sets the pokemon for this specific condition
    setPokemon(pokemon){
        this.pokemon = pokemon;
    }

    update(dt){
        this.timer.update(dt);
        this.lifetime += dt;
    }

    render(){
        context.beginPath();
        context.arc(this.pokemon.position.x + this.pokemon.dimensions.x / 2, this.pokemon.position.y + this.pokemon.dimensions.y / 2, Tile.SIZE / 2, 0, 2 * Math.PI, false);
        context.fillStyle = Colour.Transparent;
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = this.colour;
        context.stroke();
    }

    // After the duratin, the severity will be reduced by 1. If the severity ever gets to 0, it's expired.
    isExpired(){
        return this.severity == 0;
    }

    /**
     * Increases severity if possible.
     */
    increaseSeverity(){
        if (this.severity == this.maxSeverity)
            return;
        
        this.severity++;
        this.add();
        
        // Reduce the severity after the duratiion
        setTimeout(() => {
            this.severity--;

            // Sometimes needed to update due to severity
            this.add();
        }, this.duration);
    }

}