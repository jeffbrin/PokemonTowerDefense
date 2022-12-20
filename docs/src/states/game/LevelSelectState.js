import StateThatSaves from "../StateThatSaves.js";
import { canvas, canvasScale, context, keys, playBackgroundMusic, sounds, stateStack } from "../../globals.js";
import Background from "../../user-interface/Background.js";
import PlayState from "./play/PlayState.js";
import FontName from "../../enums/FontName.js";
import Colour from "../../enums/Colour.js";
import LevelSelectLevelsPanel from "../../user-interface/LevelSelectState/LevelSelectLevelsPanel.js";
import Inventory from "../../objects/Inventory.js";
import PokemonFactory from "../../services/PokemonFactory.js";
import TeamSelectState from "./PartySelectState.js";
import PokedexNumber from "../../enums/PokedexNumber.js";
import LevelSelectStateBackButton from "../../user-interface/LevelSelectState/LevelSelectStateBackButton.js";
import SoundName from "../../enums/SoundName.js";
export default class LevelSelectState extends StateThatSaves
{
    static NUM_LEVELS = 5;
    static colours = [Colour.White, Colour.DodgerBlue, Colour.Gold, Colour.Chartreuse];
    constructor(pokemonInventory = Inventory.getInstance())
    {
        super();
        this.background = new Background();
        this.pokemonInventory = pokemonInventory;
    }

    async enter()
    {
        this.mousemoveCallback = (e) => this.handleMouseMove(e);
        this.mouseDownListener = (e) => this.handleMouseDown(e);
        this.attachEventListeners();

        // Took this out because play states are initialized later in the party select state
        // Just pass the level number to the party select state instead
        this.playStates = await this.initializeLevels(LevelSelectState.NUM_LEVELS);
        this.uiElements = await this.initializeUI(this.playStates.map(state => state.level));
    }

    async reenter(){
        super.reenter();
        this.uiElements = await this.initializeUI(this.playStates.map(state => state.level));
    }

    exit()
    {
        super.exit();
        stateStack.states[stateStack.states.length - 2].attachEventListeners();
        this.removeEventListeners();
    }

    removeEventListeners()
    {
        canvas.removeEventListener("mousemove", this.mousemoveCallback);
        canvas.removeEventListener("mousedown", this.mouseDownListener);
    }

    attachEventListeners()
    {
        super.attachEventListeners();
        canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e), { once: true });
        canvas.addEventListener("mousemove", this.mousemoveCallback);
        canvas.addEventListener("mousedown", this.mouseDownListener);
        playBackgroundMusic(SoundName.GeneralBackground)
    }

    async update(dt)
    {

    }
    render()
    {
        this.background.render();
        this.printText();

        // Return until the ui elements are loaded
        if(!this.uiElements)
            return

        Object.values(this.uiElements).forEach(element => element.render());
    }
    async initializeLevels(numLevels)
    {
        let playstates = [];
        for (let i = 0; i < numLevels; i++)
        {
            playstates.push(await PlayState.createPlaystate(i + 1));
        }
        return playstates;

    }
    async initializeUI(levels)
    {

        return { LevelsPanel: new LevelSelectLevelsPanel(levels), Button: new LevelSelectStateBackButton("Back") };
    }
    printText()
    {
        context.save();

        context.fillStyle = Colour.Crimson;
        context.font = `48px ${ FontName.Pokemon }`;
        context.fillText("Select The Level", 20, 75, canvas.width - 40);

        context.restore();
    }
    handleMouseMove(event)
    {
        const x = event.offsetX / canvasScale;
        const y = event.offsetY / canvasScale;
        if (this.didMouseHitObject(x, y, this.uiElements.Button))
        {
            this.uiElements.Button.onHover();
        }
        else
        {
            this.uiElements.Button.onNoHover();
        }

        // Hover on a Level
        const levels = this.uiElements.LevelsPanel.levelBoxes;
        const hoveredLevels = this.uiElements.LevelsPanel.levelBoxes.filter(levelBox => this.uiElements.LevelsPanel.didMouseHitObject(x, y, levelBox));

        if (hoveredLevels.length === 1 && !hoveredLevels[0].locked)
        {
            this.uiElements.LevelsPanel.selector.onHover(hoveredLevels[0].position.x, hoveredLevels[0].position.y);
        }
        else if (hoveredLevels.length === 0)
        {
            this.uiElements.LevelsPanel.selector.onNoHover();
        }


    }
    handleMouseUp(event)
    {

    }
    async handleMouseDown(event)
    {
        // Loop through all clickables
        const x = event.offsetX / canvasScale;
        const y = event.offsetY / canvasScale;

        // Click on Button
        const button = this.uiElements.Button;
        // console.log(`x: ${ x }, y: ${ y }`);
        let clickedButton = null;
        if (this.didMouseHitObject(x, y, button))
            clickedButton = this.uiElements.Button;

        if (clickedButton)
        {
            clickedButton.onPress();
            stateStack.pop();
            return;
        }

        // Click on a Level
        const levels = this.uiElements.LevelsPanel.levelBoxes;
        const clickedLevels = levels.filter((levelBox, index) =>
        {
            if (this.uiElements.LevelsPanel.didMouseHitObject(x, y, levelBox))
            {
                levelBox.index = index;
                return true;
            }
        }
        );

        if (clickedLevels.length === 1 && !clickedLevels[0].locked)
        {
            // console.log(`LevelBox Clicked?: ${ clickedLevels ? JSON.stringify(clickedLevels[0]) : 'no' }`);
            sounds.play(SoundName.LevelSelect);
            this.removeEventListeners();
            stateStack.push(new TeamSelectState(this.pokemonInventory, clickedLevels[0].index + 1));
        }


    }
    didMouseHitObject(x, y, object)
    {
        return x >= object.position.x
            && x <= object.position.x + object.dimensions.x
            && y >= object.position.y
            && y <= object.position.y + object.dimensions.y;
    }
}