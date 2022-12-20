import StateThatSaves from "../StateThatSaves.js";
import { isPointInObject } from "../../../lib/CollisionHelper.js";
import { stateStack, canvas, canvasScale, sounds } from "../../globals.js";
import StarterPokemonFocusState from "./starterPokemon/StarterPokemonFocusState.js";
import Inventory from "../../objects/Inventory.js";
export default class SelectState extends StateThatSaves
{
    /**
     * 
     * @param {Array} selectables array of clickable (selectable) objects
     */
    constructor(selectables, callback)
    {
        super();
        this.selectables = selectables;
        this.selectables.forEach(selectable => { selectable.wasSelected = false; });
        this.callback = callback;
    }
    enter()
    {
        this.mousemoveCallback = (e) => this.handleMouseMove(e);
        this.mouseDownListener = (e) => this.handleMouseDown(e);
        this.attachEventListeners();
    }
    reenter()
    {
        super.reenter();
        this.attachEventListeners();
    }
    exit()
    {
        super.exit();
        this.removeEventListeners();

    }
    update(dt)
    {
        if (Inventory.getInstance().party.length != 0)
        {
            stateStack.pop();
            this.callback();
        }
    }
    removeEventListeners()
    {
        canvas.removeEventListener("mouseup", this.mouseUpCallback);
        canvas.removeEventListener("mousemove", this.mousemoveCallback);
        canvas.removeEventListener("mousedown", this.mouseDownListener);
    }

    attachEventListeners()
    {
        super.attachEventListeners();
        canvas.addEventListener("mouseup", this.mouseUpCallback);
        canvas.addEventListener("mousemove", this.mousemoveCallback);
        canvas.addEventListener("mousedown", this.mouseDownListener);
    }
    mouseUpCallback()
    {

    }
    handleMouseDown(event)
    {
        const x = event.offsetX / canvasScale;
        const y = event.offsetY / canvasScale;
        this.selectables.forEach((selectable, index) =>
        {
            if (isPointInObject(x, y, selectable))
            {
                //show info screen of selected Pokemon
                this.removeEventListeners();
                stateStack.push(new StarterPokemonFocusState(selectable, index));
                sounds.play(`Pokemon${index*3+1}`);
            }
        });
    }
    handleMouseMove(event)
    {
        const x = event.offsetX / canvasScale;
        const y = event.offsetY / canvasScale;
        this.selectables.forEach(selectable =>
        {
            if (isPointInObject(x, y, selectable))
            {
                selectable.isHovering = true;
                selectable.onHover();
            }
            else
            {
                selectable.isHovering = false;
            }
        });
    }
    render()
    {
        this.selectables.forEach(selectable => selectable.render());
    }
}