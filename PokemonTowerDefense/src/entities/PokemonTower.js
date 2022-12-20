import Vector from "../../lib/Vector.js";
import Colour from "../enums/Colour.js";
import { context, timer } from "../globals.js";
import Tile from "../services/Tile.js";
import Panel from "../user-interface/Panel.js";
import Pokemon from "./Pokemon.js"
import PokemonType from "../enums/PokemonType.js";
import AttackType from "../enums/AttackType.js";
import StateMachine from "../../lib/StateMachine.js";
import PokemonTowerIdleState from "../states/entity/PokemonTower/PokemonTowerIdleState.js";
import StateStack from "../../lib/StateStack.js";

export default class PokemonTower{
    
    static StateNames = {
        Idle: "Idle",
        Attacking: "Attacking"
    }

    // TODO: See if we want to make this dynamic per pokemon. (Based on speed or something)
    // The range in tiles
    static DEFAULT_RANGE = 3

    constructor(pokemon, towerSlot, level){
        this.pokemon = pokemon;
        this.towerSlot = towerSlot;
        this.pokemon.position = new Vector(this.towerSlot.position.x, this.towerSlot.position.y);
        this.level = level;
        this.stateStack = new StateStack();
        this.stateStack.push(new PokemonTowerIdleState(this));
    }

    update(dt){
        this.stateStack.update(dt);
    }

    render(){
        this.stateStack.render();
    }

    cooldown(downtime){
        this.pokemon.attacking = false;
        this.pokemon.coolingDown = true;
        this.pokemon.timer.addTask(() => {}, 0, downtime, () => this.pokemon.coolingDown = false);
    }

    isStabAttack(attack){
        let typeString = attack.type
        switch(typeString.charAt(0).toUpperCase() + typeString.slice(1)){
            case AttackType.Normal:
                return this.pokemon.types.includes(PokemonType.Normal);
            case AttackType.Fighting:
                return this.pokemon.types.includes(PokemonType.Fighting);
            case AttackType.Flying:
                return this.pokemon.types.includes(PokemonType.Flying);
            case AttackType.Poison:
                return this.pokemon.types.includes(PokemonType.Poison);
            case AttackType.Ground:
                return this.pokemon.types.includes(PokemonType.Ground);
            case AttackType.Rock:
                return this.pokemon.types.includes(PokemonType.Rock);
            case AttackType.Bug:
                return this.pokemon.types.includes(PokemonType.Bug);
            case AttackType.Ghost:
                return this.pokemon.types.includes(PokemonType.Ghost);
            case AttackType.Fire:
                return this.pokemon.types.includes(PokemonType.Fire);
            case AttackType.Water:
                return this.pokemon.types.includes(PokemonType.Water);
            case AttackType.Grass:
                return this.pokemon.types.includes(PokemonType.Grass);
            case AttackType.Electric:
                return this.pokemon.types.includes(PokemonType.Electric);
            case AttackType.Psychic:
                return this.pokemon.types.includes(PokemonType.Psychic);
            case AttackType.Ice:
                return this.pokemon.types.includes(PokemonType.Ice);
            case AttackType.Dragon:
                return this.pokemon.types.includes(PokemonType.Dragon);
            case AttackType.Steel:
                return this.pokemon.types.includes(PokemonType.Steel);
            case AttackType.Dark:
                return this.pokemon.types.includes(PokemonType.Dark);
            case AttackType.Fairy:
                return this.pokemon.types.includes(PokemonType.Fairy);
        }
    }

}