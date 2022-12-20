import Colour from "../../enums/Colour.js";
import Stat from "../../enums/Stat.js";
import { context } from "../../globals.js";
import LevelFactory from "../../services/LevelFactory.js";
import Tile from "../../services/Tile.js";
import Panel from "../Panel.js";
import Textbox from "../Textbox.js";

export default class PokemonDetailsPanel extends Panel{
    static DIMENSIONS = {width: 9, height: 12.12}
    constructor(pokemon){
        super(0, 0, PokemonDetailsPanel.DIMENSIONS.width, PokemonDetailsPanel.DIMENSIONS.height, {panelColour: "rgba(0, 0, 0, 0.8)", borderColour: Colour.Transparent, borderWidth: 4})
        this.pokemon = pokemon;
    }

    render(){
        super.render();

        // Write all the info
        context.save();
        context.textBaseline = "top";
        context.fillStyle = Colour.White;
        let fontSize = 12
        context.font = `${fontSize}px ${Textbox.FONT_FAMILY}`

        const top = this.position.y;
        const left = this.position.x;
        const padding = Tile.SIZE / 2;

        // Pokemon Name
        context.fillText(this.pokemon.name, left + padding, top + padding)

        // Stats
        fontSize = 8
        context.font = `${fontSize}px ${Textbox.FONT_FAMILY}`
        context.fillText(`HP: ${this.pokemon.stats[Stat.HP]}`, left + padding, top + padding + fontSize + Tile.SIZE)
        context.fillText(`Attack: ${this.pokemon.stats[Stat.Attack]}`, left + padding, top + padding + fontSize * 2 + Tile.SIZE)
        context.fillText(`Defence: ${this.pokemon.stats[Stat.Defense]}`, left + padding, top + padding + fontSize * 3 + Tile.SIZE)
        context.fillText(`Sp.Attack: ${this.pokemon.stats[Stat.SPAttack]}`, left + padding, top + padding + fontSize * 4 + Tile.SIZE)
        context.fillText(`Sp.Defense: ${this.pokemon.stats[Stat.SPDefense]}`, left + padding, top + padding + fontSize * 5 + Tile.SIZE)
        context.fillText(`Speed: ${this.pokemon.stats[Stat.Speed]}`, left + padding, top + padding + fontSize * 6 + Tile.SIZE)

        // Types
        context.fillText("Type(s)", left + padding, top + padding + fontSize * 6 + Tile.SIZE * 2)
        this.pokemon.types.forEach((type, index) => {
            context.fillText(type.name, left + padding, top + padding + fontSize * (7 + index) + Tile.SIZE * 2.25)
        });
        

        context.restore();

    }
}