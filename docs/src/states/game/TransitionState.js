import StateThatSaves from "../StateThatSaves.js";
import
{
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    stateStack,
    timer,
} from "../../globals.js";

export default class TransitionState extends StateThatSaves
{
    static TYPE = { In: 0, Out: 1 };

    constructor(type, onTransitionComplete = () => { }, colour = { r: 255, g: 255, b: 255 })
    {
        super();

        this.colour = colour;

        if (type === TransitionState.TYPE.Out)
        {
            this.alpha = 1;
            this.endAlpha = 0;
        }
        else
        {
            this.alpha = 0;
            this.endAlpha = 1;
        }

        timer.tween(this, ['alpha'], [this.endAlpha], 1.5, () =>
        {
            stateStack.pop();
            onTransitionComplete();
        });
    }

    enter(){
        super.enter();
    }

    render()
    {
        context.save();
        context.fillStyle = `rgba(${ this.colour.r }, ${ this.colour.g }, ${ this.colour.b }, ${ this.alpha })`;
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.restore();
    }

    /**
     * Smoothly transitions from one state to another with a nice fade.
     * By default, pops the last state halfway through the fade.
     *
     * @param {function} betweenEvent
     */
    static fade(betweenEvent = () => stateStack.pop())
    {
        stateStack.push(new TransitionState(TransitionState.TYPE.In, () =>
        {
            betweenEvent();
            stateStack.push(new TransitionState(TransitionState.TYPE.Out));
        }));
    }
}
