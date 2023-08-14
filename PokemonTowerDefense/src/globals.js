import Fonts from "../lib/Fonts.js";
import Images from "../lib/Images.js";
import Sounds from "../lib/Sounds.js";
import StateStack from "../lib/StateStack.js";
import Timer from "../lib/Timer.js";
import Vector from "../lib/Vector.js";
import { EXISTING_STATUS_MOVE_NAMES } from "./services/AttackFactory.js";
import PokemonFactory from "./services/PokemonFactory.js";

export const canvas = document.createElement('canvas');
export const context = canvas.getContext('2d') || new CanvasRenderingContext2D();
export const POKEMON_DATA = await (await fetch("./src/pokemon.json")).json();
POKEMON_DATA.forEach(pokemon => {
    pokemon.name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
});

// Get moves and filter out status moves since they aren't implemented
export const MOVES = (await (await fetch("./src/attacks.json")).json()).filter(
    move => move.damage_class != "status" || EXISTING_STATUS_MOVE_NAMES.includes(move.name)
);

// Replace these values according to how big you want your canvas.
export const CANVAS_WIDTH = 21 * 16;
export const CANVAS_HEIGHT = 17 * 16;
export const CANVAS_WIDTH_IN_TILES = 21;
export const CANVAS_HEIGHT_IN_TILES = 17;

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateStack = new StateStack();
export const timer = new Timer();
export const sounds = new Sounds();

export const pokemonFactory = new PokemonFactory();
export const DEBUG = false;
export const CATCHABLE_HEALTH_PERCENTAGE = 0.20;
export const criticalHitChance = 0.05;
export const canvasScale = 3;

export const mousePosition = new Vector(0, 0);
canvas.addEventListener("mousemove", (event) => {
    mousePosition.x = event.offsetX / canvasScale;
    mousePosition.y = event.offsetY / canvasScale;
});

export const pokedollarIcon = "$";

let highestUnlockedLevel = 1;
export const setHighestUnlockedLevel = (level) => highestUnlockedLevel = level;
export const getHighestUnlockedLevel = () => { return highestUnlockedLevel };

let music;
let musicName;
export const playBackgroundMusic = (soundName) => {
    if (music) {
        if (musicName == soundName)
            return
        music.stop();
    }
    music = sounds.get(soundName);
    music.play();
    musicName = soundName;
}

export const stopBackgroundMusic = () => {
    music.stop();
    musicName = "";
}

export const pauseBackgroundMusic = () => {
    music.pause();
}

export const resumeBackgroundMusic = () => {
    music.play();
}

let playerUsername;
export const setUsername = (username) => {
    playerUsername = username;
}

export const getUsername = () => {
    return playerUsername;
}

export const SHINY_POKEMON_CHANCE = 1 / 2000

// https://www.geeksforgeeks.org/how-to-detect-whether-the-website-is-being-opened-in-a-mobile-device-or-a-desktop-in-javascript/
/* Storing user's device details in a variable*/
let details = navigator.userAgent;

/* Creating a regular expression 
containing some mobile devices keywords 
to search it in details string*/
let regexp = /android|iphone|kindle|ipad/i;

/* Using test() method to search regexp in details
it returns boolean value*/
// export const IS_MOBILE_DEVICE = regexp.test(details);
export const IS_MOBILE_DEVICE = true;
