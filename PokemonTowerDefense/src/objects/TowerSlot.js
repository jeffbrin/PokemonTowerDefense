import Vector from "../../lib/Vector.js"
import Colour from "../enums/Colour.js"
import Tile from "../services/Tile.js"
import Panel from "../user-interface/Panel.js"
import GameObject from "./GameObject.js"

export default class TowerSlot extends GameObject{

    /**
     * Creates a new TowerSlot at the given tile position.
     * @param {Vector} position The position (In terms of tiles).
     */
    constructor(position){
        super(new Vector(position.x * Tile.SIZE, position.y * Tile.SIZE), new Vector(Tile.SIZE, Tile.SIZE))
        this.outline = new Panel(position.x, position.y, 1, 1, {panelColour: Colour.Transparent, borderColour: "rgba(0, 0, 0, 0.5)"})
    }

    update(dt){
    }

    render(){
        this.outline.render();
    }

}