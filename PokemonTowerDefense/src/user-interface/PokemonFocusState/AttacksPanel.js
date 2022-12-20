import Colour from "../../enums/Colour.js";
import Tile from "../../services/Tile.js";
import Panel from "../Panel.js";
import AttackButton from "./AttackButton.js";

export default class AttacksPanel extends Panel{

    static DIMENSIONS = {x: 6, y: Panel.POKEMON_FOCUS_BOTTOM.height - 1};

    constructor(pokemon, x = Panel.POKEMON_FOCUS_BOTTOM.x + 0.25, y = Panel.POKEMON_FOCUS_BOTTOM.y + 0.5, width = AttacksPanel.DIMENSIONS.x, height = AttacksPanel.DIMENSIONS.y){
        super(x, y, width, height, {panelColour: Colour.Black, borderWidth: 2, borderColour: Colour.White})
        this.pokemon = pokemon;
        this.attackButtons = this.generateAttackPanels(pokemon);
    }

    generateAttackPanels(pokemon){
        const panels = pokemon.attacks.map((attack, index) => {
            return new AttackButton(
                this.position.x / Tile.SIZE, 
                ((this.position.y + index) / Tile.SIZE) + (index * AttacksPanel.DIMENSIONS.y / 4),
                this.dimensions.x / Tile.SIZE,
                (this.dimensions.y - 1) / 4 / Tile.SIZE, 
                attack,
                pokemon);
        });
        return panels;
    }

    update(dt){
        if(this.attackButtons.map(button => button.attack) != this.pokemon.attacks){
            this.attackButtons = this.generateAttackPanels(this.pokemon);
        }
    }

    render(){
        super.render();
        this.attackButtons.forEach(attackButton => attackButton.render());
    }
}