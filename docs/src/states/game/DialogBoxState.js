//This state is for cutscenes when there is a dialog box that will appear
//and the player must press enter to go through the text

import StateThatSaves from "../StateThatSaves.js";
import SoundName from "../../enums/SoundName.js";
import { sounds, stateStack } from "../../globals.js";
import Panel from "../../user-interface/Panel.js";
import Textbox from "../../user-interface/Textbox.js";

export default class DialogueBoxState extends StateThatSaves
{
    /**
     * State that presents a Textbox to the player
     * and performs a callback after the Textbox closes.
     *
     * @param {string} text
     * @param {object} placement Where on the screen the Textbox should be displayed.
     * @param {function} callback
     */
    constructor(text, placement = Panel.BOTTOM_DIALOGUE, callback = () => { })
    {
        super();

        this.textbox = new Textbox(
            placement.x,
            placement.y,
            placement.width,
            placement.height,
            text,
            { isAdvanceable: true }
        );
        this.callback = callback;
    }

    enter()
    {
        sounds.play(SoundName.MenuOpen);
    }

    update()
    {
        this.textbox.update();

        if (this.textbox.isClosed)
        {
            stateStack.pop();
            this.callback();
        }
    }

    render()
    {
        this.textbox.render();
    }
}