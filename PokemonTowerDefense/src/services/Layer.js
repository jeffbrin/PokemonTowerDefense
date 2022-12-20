import Vector from "../../lib/Vector.js";
import Tile from "./Tile.js";

/**
 * Credit to Vikram Singh's Pokemon Game
 */
export default class Layer
{
    static BOTTOM = 0;
    static COLLISION = 1;
    static TOP = 2;
    static PATH = 3;
    static TOWER_POSITIONS = 4;
    static PADDING = 5;

    /**
     * A collection of tiles that comprises
     * one layer of the map. The tiles are stored
     * in a 1D array instead of a 2D array to make
     * accessing an individual tile more efficient
     * when the layers are thousands of tiles long.
     *
     * @param {object} layerDefinition
     * @param {array} sprites
     */
    constructor(layerDefinition, sprites, layerNum)
    {
        this.tiles = Layer.generateTiles(layerDefinition.data, sprites);
        this.width = layerDefinition.width;
        this.height = layerDefinition.height;
        if (layerNum === Layer.PATH)
        {
            this.pathPoints = this.getPathPoints();
        }
    }

    render()
    {
        for (let y = 0; y < this.height; y++)
        {
            for (let x = 0; x < this.width; x++)
            {
                this.getTile(x, y)?.render(x, y);
            }
        }
    }

    /**
     * The Y coordinate is multiplied by the map width
     * to get us to the correct row, then the X coordinate
     * is added to get us to the correct column in that row.
     *
     * @param {number} x
     * @param {number} y
     * @returns The Tile that lives at (x, y) in the layer.
     */
    getTile(x, y)
    {
        return this.tiles[x + y * this.width];
    }

    /**
     * @param {object} layerData The exported layer data from Tiled.
     * @param {array} sprites
     * @returns An array of Tile objects.
     */
    static generateTiles(layerData, sprites)
    {
        const tiles = [];

        layerData.forEach((tileId) =>
        {
            // Tiled exports tile data starting from 1 and not 0, so we must adjust it.
            tileId--;

            // -1 means there should be no tile at this location.
            const tile = tileId === -1 ? null : new Tile(tileId, sprites);

            tiles.push(tile);
        });

        return tiles;
    }
    getPathPoints()
    {
        let points = [];
        for (let i = 0; i < this.tiles.length; i++)
        {
            if (this.tiles[i] != null)
            {
                this.tiles[i].indexOnMap = i;
                points.push({tile: this.tiles[i], index: i});
            }
        }
        points.sort((a, b) => a.tile.id - b.tile.id);
        return points.map(p => new Vector(p.index % this.width * Tile.SIZE, Math.floor(p.index / this.width) * Tile.SIZE));
    }

    getTowerSlotPositions(){
        let points = [];
        for (let i = 0; i < this.tiles.length; i++)
        {
            if (this.tiles[i] != null)
            {
                this.tiles[i].indexOnMap = i;
                points.push({tile: this.tiles[i], index: i});
            }
        }
        return points.map(p => new Vector(p.index % this.width, Math.floor(p.index / this.width)));
    }
}