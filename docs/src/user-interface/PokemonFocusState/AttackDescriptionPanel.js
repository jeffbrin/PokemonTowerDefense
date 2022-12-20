import Colour from "../../enums/Colour.js";
import { context } from "../../globals.js";
import Panel from "../Panel.js";
import AttacksPanel from "./AttacksPanel.js";

export default class AttackDescriptionPanel extends Panel{

    static DIMENSIONS = {x: 10, y: Panel.POKEMON_FOCUS_BOTTOM.height - 1};

    constructor(pokemon, x = Panel.POKEMON_FOCUS_BOTTOM.x + 0.25 + AttacksPanel.DIMENSIONS.x, y = Panel.POKEMON_FOCUS_BOTTOM.y + 0.5){
        super(x, y, AttackDescriptionPanel.DIMENSIONS.x, AttackDescriptionPanel.DIMENSIONS.y, {panelColour: Colour.Black, borderWidth: 2, borderColour: Colour.White})
        this.pokemon = pokemon;
        this.fontSize = Panel.FONT_SIZE - 1;
        this.fontFamily = Panel.FONT_FAMILY;
        this.fontColour = Colour.White;
        this.padding = 4;
    }

    render(){

        super.render();
        context.save();
        context.textBaseline = 'top';
		context.font = `${ this.fontSize }px ${ this.fontFamily }`;
		context.fillStyle = this.fontColour;

        // Render description
        const selectedAttack = this.pokemon.selectedAttack;
        const page = this.createDescriptionList(selectedAttack.description ?? "No Description", this.dimensions.x - 6);
        const maxLines = 3;
        page.forEach((line, index) =>
		{
            if(index > 3)
                return;
            if(index == 3)
                line = line + "..."
			context.fillText(line, this.position.x + 2, this.position.y + index * this.fontSize + this.padding);
		});

        const left = this.position.x + 2;
        // Render Type
        context.fillText(`Type: ${selectedAttack.type}`, left, this.position.y + 4.25 * this.fontSize + this.padding);

        // Render attack power
        context.fillText(`Power: ${selectedAttack.power ?? "N/A"}`, left, this.position.y + 5.25 * this.fontSize + this.padding);

        // Render Category
        context.fillText(`Category: ${selectedAttack.damageClass.charAt(0).toUpperCase() + selectedAttack.damageClass.slice(1)}`, left, this.position.y + 6.25 * this.fontSize + this.padding);

        // Render accuracy
        context.fillText(`Accuracy: ${selectedAttack.accuracy ?? "N/A"}`, left, this.position.y + 7.25 * this.fontSize + this.padding);

        context.restore();
    }

    /**
	 * @param {string} text
	 * @param {number} width The width of the textbox.
	 * @returns The paginated text based on the specified width.
	 */
	createDescriptionList(text, width)
	{
		const lines = this.getLines(text, width);
		const linesPerPage = Math.floor((this.dimensions.y - this.padding) / this.fontSize);
		const maxPages = Math.ceil(lines.length / linesPerPage);
		const pages = [];

		for (let page = 0; page < maxPages; page++)
		{
			pages.push([]);

			for (let line = 0; line < linesPerPage; line++)
			{
				if (lines.length === 0)
				{
					break;
				}

				pages[page][line] = lines.splice(0, 1);
			}
		}

		return pages[0];
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