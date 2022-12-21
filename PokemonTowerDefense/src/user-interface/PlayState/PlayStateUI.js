import { CANVAS_WIDTH } from "../../globals.js";
import Tile from "../../services/Tile.js";
import Button from "../Button.js";
import PlayStatePartyUI from "./PlayStatePartyUI.js";
import Pokeball from "./Pokeball.js";

export default class PlayStateUI{
    constructor(inventory){
        this.inventory = inventory;
        this.partyView = new PlayStatePartyUI(inventory.party)
        this.pokeball = new Pokeball();
        this.runButton = new Button(CANVAS_WIDTH / Tile.SIZE - 3.25, 0.25, 3, 1.5, "Run");
    }

    update(dt){
        this.partyView.update(dt);
        this.pokeball.update(dt);
    }

    render(){
        this.partyView.render();
        this.runButton.render();
    }

    renderPokeball(){
        this.pokeball.render();
    }
}