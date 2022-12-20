import { didSucceedPercentChance, getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";
import Vector from "../../lib/Vector.js";
import RareCandy from "../entities/RareCandy.js";
import { canvas, canvasScale, stateStack, timer } from "../globals.js";
import Tile from "../services/Tile.js";
import CatchingState from "../states/game/play/CatchingState.js";
import MovingPartyPokemonState from "../states/game/play/MovingPartyPokemonState.js";
import MovingTowerState from "../states/game/play/MovingTowerState.js";
import PlayStateUI from "../user-interface/PlayState/PlayStateUI.js";
import TowerSlot from "./towerSlot.js";
import PokemonFocusState from "../states/game/play/PokemonFocusState.js";
import LevelSelectState from "../states/game/LevelSelectState.js"
import CutSceneState from "../states/game/CutSceneState.js";
import Timer from "../../lib/Timer.js";
import { ShinyPokemonAppearedState } from "../states/game/play/ShinyPokemonAppearedState.js";

export default class Level{
    static DEFAULT_POKEMON_SPAWN_DELAY = 2;
    constructor(wildPokemonQueue, rareCandyCount, map, inventory, colourTheme, name, imageName, levelNumber, pokeballsProvided, victoryCutscene = new CutSceneState([(callback) => {callback()}]), lossCutscene = new CutSceneState([(callback) => {callback()}]), introCutscene = new CutSceneState([(callback) => {callback()}]), pokemonSpawnDelay = Level.DEFAULT_POKEMON_SPAWN_DELAY, cutscenePerson = []){
        this.borderColour = colourTheme;
        this.wildPokemonQueue = wildPokemonQueue;
        this.map = map;
        this.pokemonPathLocations = map.getPathPoints();
        this.rareCandies = this.generateRareCandies(rareCandyCount);
        this.towerSlots = this.generateTowerSlots(map.getTowerSlotPositions());
        this.pokemonTowers = [];
        this.runningPokemon = [];
        this.inventory = inventory;
        this.ui = new PlayStateUI(inventory);
        this.victoryCutscene = victoryCutscene;
        this.lossCutscene = lossCutscene;
        this.introCutscene = introCutscene;
        this.preventWildPokemonSpawing = false;
        this.cutscenePerson = cutscenePerson;
        this.name = name;
        this.imageName = imageName;
        this.levelNumber = levelNumber;
        this.pokeballsProvided = pokeballsProvided;
        
        // Set the level for each pokemon.
        wildPokemonQueue.forEach(wildPokemon => {
            wildPokemon.setLevel(this);
        })

        this.timer = new Timer();

        this.timer.addTask(
            () => {
                if(this.wildPokemonQueue.length > 0){
                    const newPokemon = this.wildPokemonQueue.splice(0, 1)[0];
                    this.runningPokemon.push(newPokemon);
                    if (newPokemon.shiny){
                        stateStack.push(new ShinyPokemonAppearedState());
                    }
                }
                },
            pokemonSpawnDelay
            );

    }

    update(dt){

        this.ui.update(dt);

        // No updating while the level is paused
        if(this.paused)
            return;
        
        this.timer.update(dt);
        this.runningPokemon = this.runningPokemon.filter(pokemon => {
            if(pokemon.isDead())
                pokemon.die();
            return !pokemon.isDead();
        });

        // Filter stolen rare candies
        // Sometimes candies get weird positions and I'm not sure why, filter those bad boys out too.
        this.rareCandies = this.rareCandies.filter(candy => !candy.stolen && !isNaN(candy.position.x) && !isNaN(candy.position.y));

        this.rareCandies.forEach(rareCandy => rareCandy.update(dt));
        this.ui.partyView.partyMemberHolders.forEach(holder => holder.update(dt));
        this.pokemonTowers.forEach(tower => tower.update(dt));

        // Sometimes the towers have 0 velocity, not sure why. Also filter them out
        this.runningPokemon.forEach(runningPokemon => runningPokemon.update(dt) && (runningPokemon.velocity.x != 0 || runningPokemon.velocity.y != 0));
        
    }

    render(){
        this.map.render();
        this.towerSlots.forEach(towerSlot => towerSlot.render());
        this.rareCandies.forEach(rareCandy => rareCandy.render());
        this.runningPokemon.forEach(runningPokemon => runningPokemon.render());
        this.pokemonTowers.forEach(tower => tower.render());
        this.map.renderTop();
        this.map.renderPadding();
        this.ui.render();
        this.cutscenePerson.forEach(person => person.render());
        this.ui.renderPokeball();
    }

    lostLevel(){
        return this.rareCandies.length == 0;
    }
    
    wonLevel(){
        return this.runningPokemon.length == 0 && this.wildPokemonQueue.length == 0;
    }

    generateTowerSlots(towerSlotPositions){
        return towerSlotPositions.map(position => new TowerSlot(position));
    }

    didMouseHitObject(x, y, object){
        return x >= object.position.x
        && x <= object.position.x + object.dimensions.x
        && y >= object.position.y
        && y <= object.position.y + object.dimensions.y;
    }

    pause(){
        this.paused = true;
    }

    unpause(){
        this.paused = false;
        timer.paused = false;
    }

    generateRareCandies(count){
        const pathPoints = this.map.getPathPoints();
        const finalPathPoint = pathPoints[pathPoints.length - 1];

        const rareCandies = []
        for(let i = 0; i < count; i++){
            rareCandies.push(new RareCandy(
                new Vector(finalPathPoint.x - Tile.SIZE / 2 * Math.random() * (didSucceedPercentChance(0.5) ? -1 : 1), finalPathPoint.y - Tile.SIZE / 2 * Math.random() * (didSucceedPercentChance(0.5) ? -1 : 1)),
                new Vector(Tile.SIZE, Tile.SIZE)
            ))
        }

        return rareCandies;
    }

}