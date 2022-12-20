import Colour from "../enums/Colour.js";
import FontName from "../enums/FontName.js";
import { context } from "../globals.js";
import Background from "./Background.js";
import Button from "./Button.js";
import Panel from "./Panel.js";

export default class AreYouSureStateUI
{
    constructor(text)
    {
        this.background = new Background("rgba(0,0,0,0.7)");
        this.backPanel = new Panel(21 / 2 - 10 / 2, 17 / 2 - 6 / 2, 10, 6, { borderColour: Colour.DarkRed, panelColour: Colour.DarkGrey });
        this.text = text;
        this.yesButton = new Button(7, 8.5, 2, 2, "Yes");
        this.noButton = new Button(12, 8.5, 2, 2, "No");
        this.fontSize = 14;
    }

    render()
    {
        this.background.render();
        this.backPanel.render();
        this.yesButton.render();
        this.noButton.render();
        this.renderText();
    }
    renderText()
    {
        context.save();

        context.font = `${ this.fontSize }px ${ FontName.PokemonGB }`;
        context.fillStyle = Colour.White;
        let lines = this.getLines(this.text, this.backPanel.dimensions.x - 20);
        context.textAlign = "center";
        lines.forEach((line, index) =>
        {
            context.fillText(line, this.backPanel.position.x + 80, this.backPanel.position.y + 20 + (index * 12));
        });

        context.restore();
    }
    /**
     * @param {string} text
     * @param {number} maxWidth
     * @returns The separated text lines based on the given maxWidth.
     */
    getLines(text, maxWidth)
    {
        const wordsByLine = text.split('\n'); // Split by new line if manually specified in text.
        const lines = [];

        wordsByLine.forEach((line) =>
        {
            const words = line.replace(/\t+/g, '').split(" "); // Remove any tab characters.

            let currentLine = words[0];

            context.font = `${ this.fontSize }px ${ this.fontFamily }`;

            for (let i = 1; i < words.length; i++)
            {
                const word = words[i];
                const width = context.measureText(currentLine + " " + word).width;

                if (width < maxWidth)
                {
                    currentLine += " " + word;
                }
                else
                {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
        });
        return lines;
    }
}