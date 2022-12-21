import { isPointInObject } from "../../lib/CollisionHelper.js";
import { canvas, canvasScale, stateStack } from "../globals.js";
import Inventory from "../objects/Inventory.js";
import AreYouSureStateUI from "../user-interface/AreYouSureStateUI.js";
import Panel from "../user-interface/Panel.js";
import StateThatSaves from "./StateThatSaves.js";

export default class AreYouSureState extends StateThatSaves
{
    constructor(pokemon)
    {
        super();
        this.ui = new AreYouSureStateUI("Are you sure, there is no going back!");
        this.pokemon = pokemon;

        this.mouseDownListener = (e) => this.manageMouseDown(e);
        this.mouseMoveListener = (e) => this.manageMouseMove(e);
        this.attachEventListeners();
    }
    enter()
    {

    }
    render()
    {
        this.ui.render();
    }
    manageMouseDown(e)
    {
        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        if (isPointInObject(x, y, this.ui.noButton))
            stateStack.pop();

        if (isPointInObject(x, y, this.ui.yesButton))
        {
            this.inventory = Inventory.getInstance();
            let index = this.inventory.party.indexOf(this.pokemon);
            if (index < 0)
            {
                index = this.inventory.box.indexOf(this.pokemon);
                this.inventory.box.splice(index, 1);
            }
            else
            {
                this.inventory.party.splice(index, 1);
            }
            stateStack.pop();
            stateStack.pop();
        }

    }
    manageMouseMove(e)
    {
        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        //YES
        if (isPointInObject(x, y, this.ui.yesButton))
            this.ui.yesButton.onHover();
        else
            this.ui.yesButton.onNoHover();

        //NO
        if (isPointInObject(x, y, this.ui.noButton))
            this.ui.noButton.onHover();
        else
            this.ui.noButton.onNoHover();

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