import StateThatSaves from "../StateThatSaves.js";
import { stateStack } from "../../globals.js";

export default class CutSceneState extends StateThatSaves
{
    /**
     * Pass in an array of callbacks to be executed in order starting from index 0
     * Each callback MUST have a callback parameter
     * Example call: [(cutSceneState) => stateStack.push(new DialogueBoxState("Text Here", Panel.BOTTOM_DIALOGUE, () => cutSceneState.nextCallback())),
     * (cutSceneState) => stateStack.push(new TweeningState([squirtle], [squirtle.position], [['x', 'y']], [[100, 10]], [1], "More text", () => cutSceneState.nextCallback()))]
     * @param {Array} callbacks  an array of callback functions
     */
    constructor(callbacks)
    {
        super();
        this.isOver = false;
        this.callbacks = callbacks;
    }
    enter()
    {
        if (!this.callbacks[0] || typeof this.callbacks[0] != 'function')
        {
            console.log("callbacks[0] must be a function");
        }
        else
        {
            this.nextCallback();
        }
    }
    /**
     * executes the function at index 0 in the callbacks array
     * when it exists and calls it's callback function which is the next function in the array of callbacks
     * [(),(),()]
     * Call function 0 which will push a state on the stack, when that state is over it will call function 1 as its callback
     * which will push a state onto the stack which will call function 2 when it gets popped off the stack which will push a state
     * onto the stack and when that state gets popped it will set is over to true as its callback which will then pop
     * the cut screen state off the stack
     * @returns 
     */
    nextCallback()
    {
        if (this.callbacks.length == 0)
        {
            this.isOver = true;
            return;
        }
        this.callbacks.splice(0, 1)[0](() => this.nextCallback());
    }
    update(dt)
    {
        if (this.isOver)
        {
            stateStack.pop();
            stateStack.top().attachEventListeners();
        }
    }
    render()
    {

    }

}