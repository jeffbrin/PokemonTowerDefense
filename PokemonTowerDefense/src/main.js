/**
 * Game Name
 *
 * Authors
 *
 * Brief description
 *
 * Asset sources
 */

import Game from "../lib/Game.js";
import SoundName from "./enums/SoundName.js";
import {
	canvas,
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	fonts,
	images,
	keys,
	MOVES,
	POKEMON_DATA,
	sounds,
	stateStack,
	timer
} from "./globals.js";
import LoadingState from "./states/game/LoadingState.js";
import TitleScreenState from "./states/game/TitleScreenState.js";

// Change here if the width or height change in index.html
const htmlCanvasWidth = 1008
const htmlCanvasHeight = 816
let bodyWidthPercentage = document.body.clientWidth / htmlCanvasWidth * 100;
let bodyHeightPercentage = document.body.clientHeight / htmlCanvasHeight * 100;
let zoom;
if (bodyWidthPercentage < bodyHeightPercentage) {
	zoom = bodyWidthPercentage
}
else {
	zoom = bodyHeightPercentage
}

document.body.style.zoom = `${zoom}%`;

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.setAttribute('tabindex', '1'); // Allows the canvas to receive user input.

// Now that the canvas element has been prepared, we can add it to the DOM.
document.body.appendChild(canvas);

// Fetch the asset definitions from config.json.
const {
	images: imageDefinitions,
	fonts: fontDefinitions,
	sounds: soundDefinitions,
} = await fetch('./src/config.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);


// Add the first state to the state stack
// stateStack.push(await PlayState.createPlaystate(1, Inventory.getInstance()));
const titleScreenState = new TitleScreenState();
stateStack.push(titleScreenState);
// stateStack.push(new StarterPokemonFocusState(new CutScenePerson(new Vector(0, 0), new Vector(150, 150), ImageName.Charmander), 1));
titleScreenState.removeEventListeners();
stateStack.push(new LoadingState("Loading Assets..."));

// Add event listeners for player input.
canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});

const game = new Game(stateStack, context, canvas.width, canvas.height, timer);


game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();


// Load attack sounds
// After loading the attack sounds, pop the loading state.
const moveSoundDefinitionsPromises = MOVES.map(async move => {
	// If the audio file doesn't exist, return null
	const splitName = move.name.split('-');
	splitName[0] = splitName[0].charAt(0).toUpperCase() + splitName[0].slice(1);
	const name = splitName.reduce((prev, current) => prev + current.charAt(0).toUpperCase() + current.slice(1));
	const response = await fetch(`${SoundName.AttacksDirectory}${name}.wav`);

	if (response.status === 404)
		return null;

	// Otherwise return the sound definition
	return {
		name: move.name,
		path: `${SoundName.AttacksDirectory}${name}.wav`,
		size: 6,
		volume: 0.3,
		loop: false,
		maxDuration: 500
	};
});
Promise.all(moveSoundDefinitionsPromises)
	.then(soundDefinitions => {
		// Pass the sound definitions and filter out the nulls
		sounds.load(soundDefinitions.filter(def => def));
		// Pop the loading state when the sound definitions are loaded
		setTimeout(() => stateStack.pop(), 1000);
	}
	)
	.catch(e =>
		console.log(e)
	);

// Load the cries
const crySoundDefinitionPromises = POKEMON_DATA.map(async pokemon => {
	// If the audio file doesn't exist, return null

	const response = await fetch(`${SoundName.CriesDirectory}${pokemon.no}.ogg`);

	if (response.status === 404)
		return null;

	// Otherwise return the sound definition
	return {
		name: `Pokemon${pokemon.no}`,
		path: `${SoundName.CriesDirectory}${pokemon.no}.ogg`,
		size: 1,
		volume: 0.3,
		loop: false
	};
});
Promise.all(crySoundDefinitionPromises)
	.then(soundDefinitions => {
		// Pass the sound definitions and filter out the nulls
		sounds.load(soundDefinitions.filter(def => def));
	}
	)
	.catch(e =>
		console.log(e)
	);
