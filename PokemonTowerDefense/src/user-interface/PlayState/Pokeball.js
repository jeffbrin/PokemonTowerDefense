import Sprite from "../../../lib/Sprite.js"
import Vector from "../../../lib/Vector.js"
import Colour from "../../enums/Colour.js"
import ImageName from "../../enums/ImageName.js"
import { context, images, mousePosition } from "../../globals.js"
import Inventory from "../../objects/Inventory.js"
import Tile from "../../services/Tile.js"
import Panel from "../Panel.js"
import UserInterfaceElement from "../UserInterfaceElement.js"
import PartyMemberHolder from "./PartyMemberHolder.js"

export default class Pokeball extends UserInterfaceElement {

    static State = { CLOSED: 0, OPEN: 1 }
    static DEFAULT_POSITION = new Vector(Panel.PARTY_MENU.x + Panel.PARTY_MENU.width + 0.25, Panel.PARTY_MENU.y - 0.25)

    constructor() {
        super(
            Pokeball.DEFAULT_POSITION.x,
            Pokeball.DEFAULT_POSITION.y,
            2,
            2
        )
        this.sprites = this.getSprites();
        this.currentSprite = Pokeball.State.CLOSED;
        this.inventory = Inventory.getInstance();
    }

    update(dt) {
        if (this.grabbed)
            this.position = new Vector(mousePosition.x - this.dimensions.x / 2, mousePosition.y - this.dimensions.y / 2);
        else
            this.position = new Vector(Pokeball.DEFAULT_POSITION.x * Tile.SIZE, Pokeball.DEFAULT_POSITION.y * Tile.SIZE);
    }

    render() {
        context.save();
        if (this.inventory.pokeballCount == 0) {
            context.fillStyle = '#fff';
            context.globalCompositeOperation = 'luminosity';
        }
        this.sprites[this.currentSprite].render(this.position.x, this.position.y, { x: 0.05, y: 0.05 });
        context.restore();

        // Write the amount of pokeballs left
        context.save();
        context.font = `12px PokemonGB`;
        context.textBaseline = 'top';
        context.fillStyle = Colour.White;
        const pokeballCount = this.inventory.pokeballCount;
        context.fillText(pokeballCount, Pokeball.DEFAULT_POSITION.x * Tile.SIZE + this.dimensions.x / 2 - context.measureText(pokeballCount).width / 2, Pokeball.DEFAULT_POSITION.y * Tile.SIZE - Tile.SIZE);
        context.restore();
    }

    getSprites() {
        return [
            new Sprite(images.get(ImageName.PokeballClosed), 0, 0, 698, 698),
            new Sprite(images.get(ImageName.PokeballOpen), 0, 0, 690, 690)
        ]
    }

    grab() {
        this.grabbed = true;
    }

    drop() {
        this.grabbed = false;
    }

}