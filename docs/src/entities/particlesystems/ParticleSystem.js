import { didSucceedPercentChance } from "../../../lib/RandomNumberHelpers.js";
import Vector from "../../../lib/Vector.js";
import Particle from "./Particle.js";

export default class ParticleSystem{
    
    constructor(origin, particleSize, colour, particleSpeed, maxParticles = 300, sprite = null, transparentDropoff = true, targetPokemon = null, targetPosition = null){
        this.particleSize = particleSize;
        this.colour = colour;
        this.sprite = sprite;
        this.transparentDropoff = transparentDropoff;
        this.targetPosition = targetPosition;
        this.targetPokemon = targetPokemon;
        this.particleSpeed = particleSpeed;
        this.maxParticles = maxParticles;
        this.particles = [];
        this.position = origin;
    }

    update(dt){
        if(this.particles.length < this.maxParticles){
            if(didSucceedPercentChance(0.25))
                this.particles.push(new Particle(new Vector(this.position.x, this.position.y), this.particleSize, this.targetPokemon ? this.targetPokemon.position : this.targetPosition, this.particleSpeed, this.colour));
        }

        this.particles.forEach(p => p.update(dt));
    }

    render(){
        this.particles.forEach(p => p.render());
    }


}