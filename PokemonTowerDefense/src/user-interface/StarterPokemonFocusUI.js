import Colour from "../enums/Colour.js";
import ImageName from "../enums/ImageName.js";
import StarterPokemonText from "../enums/StarterPokemonText.js";
import { context, images, pokemonFactory } from "../globals.js";
import PokemonFactory from "../services/PokemonFactory.js";
import Tile from "../services/Tile.js";
import Background from "./Background.js";
import Button from "./Button.js";
import Panel from "./Panel.js";
import ImagePanel from "./TitleScreenState/ImagePanel.js";
import UserInterfaceElement from "./UserInterfaceElement.js";


export default class StarterPokemonFocusUI
{

    static CLOSE_BUTTON = { x: 15.75, y: 14.75, width: 3, height: 1.75 };
    static POKEMON_PANEL = { x: 21 / 2, y: 0, width: 21 / 2, height: 17 };
    static INFO_PANEL = { x: 0, y: 0, width: 21 / 2, height: 17 };
    constructor(cutScenePokemon, index)
    {
        this.enum = this.feedInformation(index);

        this.background = new Background();
        this.pokemonPanel = new Panel(StarterPokemonFocusUI.POKEMON_PANEL.x + 0.25,
            StarterPokemonFocusUI.POKEMON_PANEL.y,
            StarterPokemonFocusUI.POKEMON_PANEL.width - 0.5,
            StarterPokemonFocusUI.POKEMON_PANEL.height,
            { panelColour: Colour.DarkGrey, borderColour: this.enum.Colour });

        this.infoPanel = new Panel(StarterPokemonFocusUI.INFO_PANEL.x + 0.25,
            StarterPokemonFocusUI.INFO_PANEL.y,
            StarterPokemonFocusUI.INFO_PANEL.width - 0.5,
            StarterPokemonFocusUI.INFO_PANEL.height,
            { panelColour: Colour.DarkGrey, borderColour: this.enum.Colour });

        this.selectButton = new Button(21 - 4, 17 - 3, 3, 2, "Select");
        this.backButton = new Button(1, 17 - 3, 3, 2, "Back");


        this.text = this.enum.Text;
        this.abilities = this.enum.Abilities;
        this.weaknesses = this.enum.Weaknesses;
        this.types = this.enum.Types;
        this.cutScenePokemon = cutScenePokemon;
        this.originalPositionX = cutScenePokemon.position.x;
        this.originalPositionY = cutScenePokemon.position.y;
        this.originalDimensionsX = cutScenePokemon.dimensions.x;
        this.originalDimensionsY = cutScenePokemon.dimensions.y;
        this.cutScenePokemon.dimensions.x = 150;
        this.cutScenePokemon.dimensions.y = 150;
        this.name = this.enum.Name;
        this.cutScenePokemon.position.x = this.pokemonPanel.position.x + this.pokemonPanel.dimensions.x / 2 - this.cutScenePokemon.dimensions.x / 2;
        this.cutScenePokemon.position.y = this.pokemonPanel.dimensions.y / 2 - this.cutScenePokemon.dimensions.y / 2;
        this.cutScenePokemon.isHovering = false;




        this.titleFont = 14;
        this.fontFamily = "PokemonGB";
        this.fontColour = Colour.White;
        this.fontSize = 8;
    }
    feedInformation(index)
    {
        switch (index)
        {
            case 0:
                return StarterPokemonText.Bulbasaur;
            case 1:
                return StarterPokemonText.Charmander;
            case 2:
                return StarterPokemonText.Squirtle;
        }
    }
    update(dt)
    {

    }
    render()
    {
        this.background.render();
        this.pokemonPanel.render();
        this.infoPanel.render();
        this.cutScenePokemon.render();
        this.renderInfo();
        this.selectButton.render();
        this.backButton.render();
    }
    renderInfo()
    {
        context.save();
        context.font = `${ this.titleFont }px ${ this.fontFamily }`;
        context.fillStyle = this.fontColour;
        const titleWidth = context.measureText(this.name).width;
        // Pokemon Name
        context.fillText(this.name, this.infoPanel.position.x + this.infoPanel.dimensions.x / 2 - titleWidth / 2, this.infoPanel.position.y + 25);

        // Stats
        let fontSize = 8;
        context.font = `${ fontSize }px ${ this.fontFamily }`;
        let allTypes = "";
        this.types.forEach((type, index) =>
        {
            if (index == 0) allTypes += type;
            else allTypes += `, ${ type }`;
        });

        let textLines = this.getLines(this.text, this.infoPanel.dimensions.x - 25);
        let lastIndex = textLines.length - 1;
        let totalHeight;
        textLines.forEach((line, index) =>
        {
            context.fillText(line, this.infoPanel.position.x + 10, this.infoPanel.position.y + 50 + (10 * index));
            if (index === lastIndex) totalHeight = this.infoPanel.position.y + 50 + (10 * index);
        });

        context.fillText(`Type(s): ${ allTypes }`, this.infoPanel.position.x + 10, totalHeight + 20, this.infoPanel.dimensions.x - 25);

        let allWeaknesses = "";
        this.weaknesses.forEach((weaknesses, index) =>
        {
            if (index == 0) allWeaknesses += weaknesses;
            else allWeaknesses += `, ${ weaknesses }`;
        });
        let weaknessesLines = this.getLines(`Weakness(es): ${ allWeaknesses }`, this.infoPanel.dimensions.x - 25);
        let weaknessLinesLength = weaknessesLines.length - 1;
        weaknessesLines.forEach((line, index) =>
        {
            context.fillText(`${ line }`, this.infoPanel.position.x + 10, totalHeight + 40 + (10 * index));
            if (weaknessLinesLength === index) totalHeight = totalHeight + 40 + (10 * index);
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