import StateThatSaves from "../../StateThatSaves.js";
import { IS_MOBILE_DEVICE, canvas, canvasScale, stateStack } from "../../../globals.js";
import Level from "../../../objects/Level.js";
import { save } from "../../../services/SaveAndLoad.js";
import Pokeball from "../../../user-interface/PlayState/Pokeball.js";
import CaughtPokemonState from "./CaughtPokemonState.js";

export default class CatchingState extends StateThatSaves {
	/**
	 * The main state used to play.
	 * @param {Level} level The selected level.
	 */
	constructor(level) {
		super();
		this.level = level;

	}


	render() {
		this.level.render();
	}

	enter() {
		canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e), { once: true });
		this.mousemoveCallback = (e) => this.handleMouseMove(e)
		if (!IS_MOBILE_DEVICE) {
			canvas.addEventListener("mousemove", this.mousemoveCallback);
		}
		else {
			canvas.addEventListener("mousedown", this.mousemoveCallback);
		}
		this.level.ui.pokeball.grab()
		this.grabbedPokeball = this.level.ui.pokeball;
		this.level.pause();
	}

	exit() {
		super.exit();
		this.level.unpause();
		canvas.removeEventListener("mousemove", this.mousemoveCallback);
	}

	update(dt) {
		// this.level.update(dt);
		this.level.ui.update(dt);
	}

	render() {
		// Render the pokeball over everything.
		this.level.ui.pokeball.render();

		// Render the pokemon the pokeball is targeting, so that if the user is hovering over 2 pokemon they know which one will be caught.
		if (this.grabbedPokeball.targetPokemon)
			this.grabbedPokeball.targetPokemon.render();
	}

	handleMouseUp(event) {
		// Let go of the pokeball
		this.grabbedPokeball.drop();
		let caughtPokemon = null;
		if (this.grabbedPokeball.currentSprite == Pokeball.State.OPEN) {
			this.grabbedPokeball.targetPokemon.getCaught();
			caughtPokemon = this.level.inventory.catch(this.grabbedPokeball.targetPokemon);
			this.level.runningPokemon = this.level.runningPokemon.filter(pokemon => pokemon != this.grabbedPokeball.targetPokemon);
			this.grabbedPokeball.targetPokemon = null;
		}

		this.grabbedPokeball.currentSprite = Pokeball.State.CLOSED;
		this.level.unpause();
		stateStack.pop();

		if (caughtPokemon) {
			stateStack.push(new CaughtPokemonState(caughtPokemon));
			save(this.level.inventory);
		}
	}

	handleMouseMove(event) {
		if (!this.grabbedPokeball)
			return;

		const x = event.offsetX / canvasScale;
		const y = event.offsetY / canvasScale;

		// Check if any pokemon is hovered over and at low health
		const catchablePokemon = this.level.runningPokemon.filter(pokemon => this.level.didMouseHitObject(x, y, pokemon) && (pokemon.lowHealth() || pokemon.shiny) && !pokemon.isBoss);
		if (catchablePokemon.length > 0) {
			this.grabbedPokeball.currentSprite = Pokeball.State.OPEN;
			this.grabbedPokeball.targetPokemon = catchablePokemon[0];
		}
		else {
			this.grabbedPokeball.currentSprite = Pokeball.State.CLOSED
			this.grabbedPokeball.targetPokemon = null;
		}
	}

}
