import StateThatSaves from "../StateThatSaves.js";
import { stateStack, timer } from "../../globals.js";
import Panel from "../../user-interface/Panel.js";
import Textbox from "../../user-interface/Textbox.js";

export default class TweeningState extends StateThatSaves
{

    /**
     * State where objects are going to be tweened. Calls the callback once all tweens are done
     * Example Call: new TweeningState( [Oak,Jeffrey] , [['x',y'], ['x','y']] , [[100,100], [0,0]] , [1,2])
     * @param {Objects[]} objectsToTween  An Array of Objects to tween
     * @param {Object[]} propertiesOnObjectsToTween An Array of object properties to tween (this can be the same as objects to tween)
     * @param {[['string']]} propertiesToTween An array of Arrays of strings of the properties to tween on the object
     * @param {[[number]]} endValues An array of arrays of numbers of the numerical end values of each objects tween
     * @param {[number]} durations An array of numbers indicating the duration of each tween
     * @param {String} text Text to display after the tween is done but also while the tweened item is still in view
     * @param {Function} callback Callback function to call, defaults to empty function call
     */
    constructor(objectsToTween, propertiesOnObjectsToTween, propertiesToTween, endValues, durations, text, callback = () => { })
    {
        super();
        this.objectsToTween = objectsToTween;
        this.propertiesOnObjectsToTween = propertiesOnObjectsToTween;
        this.propertiesToTween = propertiesToTween;
        this.endValues = endValues;
        this.durations = durations;
        this.callback = callback;
        this.numberOfTweens = objectsToTween.length;
        this.tweensDone = 0;
        this.text = text;

        this.callback = callback;
    }
    enter()
    {
        for (let i = 0; i < this.objectsToTween.length; i++)
        {
            timer.tween(this.propertiesOnObjectsToTween[i], this.propertiesToTween[i], this.endValues[i], this.durations[i], () => this.tweensDone += 1);
        }
    }
    update()
    {
        if (this.numberOfTweens === this.tweensDone)
        {
            this.textbox = new Textbox(
                Panel.BOTTOM_DIALOGUE.x,
                Panel.BOTTOM_DIALOGUE.y,
                Panel.BOTTOM_DIALOGUE.width,
                Panel.BOTTOM_DIALOGUE.height,
                this.text,
                { isAdvanceable: true }
            );
            this.tweensDone++;
        }
        if (this.textbox)
        {
            this.textbox.update();
            if (this.textbox.isClosed)
            {
                stateStack.pop();
                this.callback();
            }
        }
    }
    render()
    {
        this.objectsToTween.forEach(object =>
        {
            object.render();
        });
        if (this.textbox)
        {
            this.textbox.render();
        }
    }
}