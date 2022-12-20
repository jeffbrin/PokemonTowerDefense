import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import Tile from "./Tile.js";
import Layer from "./Layer.js";
import Colour from "../enums/Colour.js";
import
{
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    context,
    DEBUG,
    images,
} from "../globals.js";

export default class Map
{
    constructor(mapDefinition, spritesheetFilename = ImageName.Tiles)
    {
        const sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(spritesheetFilename),
            Tile.SIZE,
            Tile.SIZE,
        );


        Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Black),
            Tile.SIZE,
            Tile.SIZE,
        ).forEach(blackSprite => sprites.push(blackSprite));

        Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.BrockTiles),
            Tile.SIZE,
            Tile.SIZE,
        ).forEach(tile => sprites.push(tile));


        this.bottomLayer = new Layer(mapDefinition.layers[Layer.BOTTOM], sprites, Layer.BOTTOM);
        this.collisionLayer = new Layer(mapDefinition.layers[Layer.COLLISION], sprites, Layer.COLLISION);
        this.topLayer = new Layer(mapDefinition.layers[Layer.TOP], sprites, Layer.TOP);
        this.pathLayer = new Layer(mapDefinition.layers[Layer.PATH], sprites, Layer.PATH);
        this.towerPositionsLayer = new Layer(mapDefinition.layers[Layer.TOWER_POSITIONS], sprites, Layer.TOWER_POSITIONS);
        this.paddingLayer = new Layer(mapDefinition.layers[Layer.PADDING], sprites, Layer.PADDING);

    }

    render()
    {
        this.bottomLayer.render();
        this.collisionLayer.render();
        this.topLayer.render();

        if (DEBUG)
        {
            Map.renderGrid();
        }
    }

    renderPadding()
    {
        this.paddingLayer.render();
    }

    renderTop()
    {
        this.topLayer.render();
    }

    /**
     * Draws a grid of squares on the screen to help with debugging.
     */
    static renderGrid()
    {
        context.save();
        context.strokeStyle = Colour.White;

        for (let y = 1; y < CANVAS_HEIGHT / Tile.SIZE; y++)
        {
            context.beginPath();
            context.moveTo(0, y * Tile.SIZE);
            context.lineTo(CANVAS_WIDTH, y * Tile.SIZE);
            context.closePath();
            context.stroke();

            for (let x = 1; x < CANVAS_WIDTH / Tile.SIZE; x++)
            {
                context.beginPath();
                context.moveTo(x * Tile.SIZE, 0);
                context.lineTo(x * Tile.SIZE, CANVAS_HEIGHT);
                context.closePath();
                context.stroke();
            }
        }

        context.restore();
    }

    getPathPoints()
    {

        // Move the first path off screen before returning
        const path = this.pathLayer.getPathPoints();
        const firstPosition = path[0];
        const secondPosition = path[1];

        const xDiff = secondPosition.x - firstPosition.x;
        const yDiff = secondPosition.y - firstPosition.y;

        // Moving down first
        if (yDiff > 0)
            firstPosition.y -= Tile.SIZE * 2;
        // Moving up first
        else if (yDiff < 0)
            firstPosition.y += Tile.SIZE * 2;
        // Moving right first
        else if (xDiff > 0)
            firstPosition.x -= Tile.SIZE * 2;
        // Moving left first
        else if (xDiff < 0)
            firstPosition.x += Tile.SIZE * 2;

        return path;
    }

    getTowerSlotPositions()
    {
        return this.towerPositionsLayer.getTowerSlotPositions();
    }
}