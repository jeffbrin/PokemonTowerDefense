import { isPointInObject } from "../../../../lib/CollisionHelper.js";
import State from "../../StateThatSaves.js";
import Colour from "../../../enums/Colour.js";
import Direction from "../../../enums/Direction.js";
import { canvas, canvasScale, CANVAS_HEIGHT, CANVAS_WIDTH, context, keys, pauseBackgroundMusic, resumeBackgroundMusic, sounds, stateStack, timer } from "../../../globals.js";
import Tile from "../../../services/Tile.js";
import Button from "../../../user-interface/Button.js";
import Panel from "../../../user-interface/Panel.js";
import SoundName from "../../../enums/SoundName.js";

export default class EvolvingState extends State{

    static PANEL_DIMENSIONS = {width: 21, height: 6}

    constructor(currentPokemon, nextStagePokemon, callback = () => {}){
        super();
        this.background = new Panel(
            (CANVAS_WIDTH / Tile.SIZE / canvasScale) - 7.1,
            (CANVAS_HEIGHT / Tile.SIZE / canvasScale) - 1,
            EvolvingState.PANEL_DIMENSIONS.width,
            EvolvingState.PANEL_DIMENSIONS.height,
            {borderWidth: 5, borderColour: Colour.Transparent, panelColour: Colour.Black});
        this.description = `${currentPokemon.name} is evolving?`

        this.cancelButton = new Button((
            CANVAS_WIDTH / Tile.SIZE / canvasScale) - 0.6 + EvolvingState.PANEL_DIMENSIONS.width / 2 - 8.5,
            (CANVAS_HEIGHT / Tile.SIZE / canvasScale) - 1 + EvolvingState.PANEL_DIMENSIONS.height / 2 + 1.5,
            4,
            1,
            "Cancel"
            )

        this.sprites = [currentPokemon.directionalSprites[Direction.DOWN][0], nextStagePokemon.directionalSprites[Direction.DOWN][0]]
        this.selectedSprite = 0;
        this.currentFlipInterval = 0.5;
        this.timeSinceLastFlip = 0;
        this.totalAnimationTime = 6;
        this.timeSinceAnimationStart = 0;
        this.nextStagePokemon = nextStagePokemon;
        this.currentPokemon = currentPokemon;  
        this.cancelled = false; 

        this.mouseDownEventListener = (e) => this.manageMouseDown(e);
        this.mouseMoveEventListener = (e) => this.manageMouseMove(e);
        canvas.addEventListener("mousedown", this.mouseDownEventListener);
        canvas.addEventListener("mousemove", this.mouseMoveEventListener);

        this.callback = callback;
    }

    enter(){
        super.enter();
        pauseBackgroundMusic();
        sounds.stop(SoundName.LevelUp);
        sounds.play(SoundName.Evolving);
    }

    update(dt){

        if(this.cancelled || this.evolutionDone){
            if(keys.Enter){
                keys.Enter = false;
                stateStack.pop();
                this.callback();
            }
            return;
        }

        this.timeSinceAnimationStart += dt;
        this.timeSinceLastFlip += dt;

        if(this.timeSinceLastFlip >= this.currentFlipInterval)
            this.flipSprite();
            

        if(this.timeSinceAnimationStart >= this.totalAnimationTime){
            this.description = `${this.currentPokemon.name} evolved into ${this.nextStagePokemon.name}!`
            this.evolve();
            this.selectedSprite = 1;
        }
        
        
    }

    render(){
        this.background.render();
        this.sprites[this.selectedSprite].render(
            CANVAS_WIDTH / 2 - this.sprites[this.selectedSprite].width / 2,
            CANVAS_HEIGHT / 2 - this.sprites[this.selectedSprite].height / 2 - 2 * Tile.SIZE,
            )

        if(!this.cancelled && !this.evolutionDone)
            this.cancelButton.render();

        context.save();
        context.fillStyle = "White";
        const textWidth = context.measureText(this.description).width;
        context.fillText(
            this.description,
            this.background.position.x + (this.background.dimensions.x - textWidth) / 2,
            this.background.position.y + 4 * Tile.SIZE,
        )

        context.restore();
    }

    exit(){
        super.exit();
        stateStack.states[stateStack.states.length - 2].attachEventListeners();
        canvas.removeEventListener("mousedown", this.mouseDownEventListener);
        canvas.removeEventListener("mousemove", this.mouseMoveEventListener);
        resumeBackgroundMusic();
    }

    evolve(){
        this.currentPokemon.sprites = this.nextStagePokemon.sprites;
        this.currentPokemon.name = this.nextStagePokemon.name;
        this.currentPokemon.types = this.nextStagePokemon.types;
        this.currentPokemon.directionalSprites = this.nextStagePokemon.directionalSprites;
        this.currentPokemon.baseStats = this.nextStagePokemon.baseStats;
        this.currentPokemon.cry = this.nextStagePokemon.cry;
        this.currentPokemon.nextStagePokemon = this.nextStagePokemon.nextStagePokemon;
        this.currentPokemon.evolutionLevel = this.nextStagePokemon.evolutionLevel;
        this.currentPokemon.pokedexNumber = this.nextStagePokemon.pokedexNumber;
        this.currentPokemon.calculateStats();
        this.evolutionDone = true;
    }

    flipSprite(){
            this.selectedSprite = (this.selectedSprite == 0) ? 1 : 0;
            this.currentFlipInterval = Math.max(0.05, this.currentFlipInterval - 0.03);
            this.timeSinceLastFlip = 0;
    }

    manageMouseDown(e){

        if(this.cancelled || this.evolutionDone){
            stateStack.pop();
            this.callback();
            return;
        }

        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        if(isPointInObject(x, y, this.cancelButton)){
            this.cancelled = true;
            this.selectedSprite = 0;
            this.description = `${this.currentPokemon.name} did not evolve...`;
            this.cancelButton.onNoHover();
            sounds.stop(SoundName.Evolving);
        }
    }

    manageMouseMove(e){

        if(this.cancelled || this.evolutionDone)
            return;

        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        if(isPointInObject(x, y, this.cancelButton)){
            this.cancelButton.onHover();
        }
        else{
            this.cancelButton.onNoHover();
        }
    }
}