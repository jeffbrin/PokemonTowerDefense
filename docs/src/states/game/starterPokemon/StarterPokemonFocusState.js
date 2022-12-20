import { isPointInObject } from "../../../../lib/CollisionHelper.js";
import { canvas, canvasScale, keys, stateStack } from "../../../globals.js";
import Inventory from "../../../objects/Inventory.js";
import PokemonFactory from "../../../services/PokemonFactory.js";
import AttackButton from "../../../user-interface/PokemonFocusState/AttackButton.js";
import StarterPokemonFocusUI from "../../../user-interface/StarterPokemonFocusUI.js";
import StateThatSaves from "../../StateThatSaves.js";


export default class StarterPokemonFocusState extends StateThatSaves
{

    /**
     * 
     * @param {CutScenePerson} cutScenePokemon Selected Pokemon
     */
    constructor(cutScenePokemon, index)
    {
        super();
        this.cutScenePokemon = cutScenePokemon;
        this.index = index;

        this.ui = new StarterPokemonFocusUI(cutScenePokemon, index);

        this.mouseDownListener = (e) => this.manageMouseDown(e);
        this.mouseMoveListener = (e) => this.manageMouseMove(e);
    }

    enter()
    {
        this.attachEventListeners();
    }

    update(dt)
    {
        this.ui.update(dt);

        // Allow the user to leave by clicking escape
        if (keys.Escape)
        {
            stateStack.pop();
            keys.Escape = false;
        }
    }

    render()
    {
        this.ui.render();
    }

    exit()
    {
        super.exit();
        if (this.level)
            this.level.unpause();
        this.removeEventListeners();

        // Reattach playstate event listeners
        // Only works because the next state is always the playstate.
        stateStack.states[stateStack.states.length - 2].attachEventListeners();
    }

    manageMouseDown(e)
    {
        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        if (isPointInObject(x, y, this.ui.backButton))
        {

            stateStack.pop();
            this.ui.cutScenePokemon.dimensions.x = this.ui.originalDimensionsX;
            this.ui.cutScenePokemon.dimensions.y = this.ui.originalDimensionsY;
            this.ui.cutScenePokemon.position.x = this.ui.originalPositionX;
            this.ui.cutScenePokemon.position.y = this.ui.originalPositionY;
        }


        if (isPointInObject(x, y, this.ui.selectButton))
        {
            Inventory.getInstance().party.push(PokemonFactory.createPokemon((this.index + 1) * 3 - 2, 5));
            stateStack.pop();
        }
    }

    manageMouseMove(e)
    {
        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        isPointInObject(x, y, this.ui.backButton) ? this.ui.backButton.onHover() : this.ui.backButton.onNoHover();
        isPointInObject(x, y, this.ui.selectButton) ? this.ui.selectButton.onHover() : this.ui.selectButton.onNoHover();
    }

    removeEventListeners()
    {
        super.removeEventListeners();
        canvas.removeEventListener("mousedown", this.mouseDownListener);
        canvas.removeEventListener("mousemove", this.mouseMoveListener);
    }

    attachEventListeners()
    {
        super.attachEventListeners();
        canvas.addEventListener("mousedown", this.mouseDownListener);
        canvas.addEventListener("mousemove", this.mouseMoveListener);
    }
}