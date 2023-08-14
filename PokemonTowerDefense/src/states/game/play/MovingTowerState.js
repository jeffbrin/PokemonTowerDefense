import StateThatSaves from "../../StateThatSaves.js";
import PokemonTower from "../../../entities/PokemonTower.js";
import { IS_MOBILE_DEVICE, canvas, canvasScale, stateStack } from "../../../globals.js";
import Level from "../../../objects/Level.js";
import PokemonFactory from "../../../services/PokemonFactory.js";

export default class MovingTowerState extends StateThatSaves {
	/**
	 * The main state used to play.
	 * @param {Level} level The selected level.
	 * @param {PokemonTower} tower The tower being moved
	 */
	constructor(level, tower) {
		super();
		this.level = level;
		this.heldTower = tower;
		this.heldTower.pokemon.pickup();

	}


	render() {
		this.level.render();
	}

	enter() {
		this.mousemoveCallback = (e) => this.handleMouseMove(e);
		if (!IS_MOBILE_DEVICE) {
			canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e), { once: true });

		} else {
			canvas.addEventListener("mousedown", (e) => this.handleMouseUp(e), { once: true });
		} canvas.addEventListener("mousemove", this.mousemoveCallback);
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

	handleMouseUp(event) {
		const x = event.offsetX / canvasScale;
		const y = event.offsetY / canvasScale;

		// Check if the currently held tower was placed on another tower slot
		const hitTowers = this.level.towerSlots.filter(tower => this.level.didMouseHitObject(x, y, tower));

		// If placed on a tower
		let newTowerSlot = null;
		if (hitTowers.length == 1) {
			newTowerSlot = hitTowers[0]
		}
		// Add back into the party
		else {
			const pokemonHolder = this.level.ui.partyView.partyMemberHolders.filter(holder => holder.pokemon == this.heldTower.pokemon)[0];
			pokemonHolder.retrievePokemonFromField()
		}

		// Find the party member holder that holds the same pokemon that's in the hit tower
		// Only do this if the pokemon wasn't placed back on the same spot i.e. the replaced pokemon is the moved pokemon.
		// If the pokemon is placed on the same spot, it means the tower should be replaced and everything but the party member holder
		// Shouldn't be told that the pokemon is back in the holder.
		const replacedTower = this.level.pokemonTowers.filter(tower => tower.towerSlot == newTowerSlot)[0];
		if (replacedTower && replacedTower != this.heldTower) {
			const replacedPokemonHolder = this.level.ui.partyView.partyMemberHolders.filter(holder => holder.pokemon == replacedTower.pokemon)[0];
			replacedPokemonHolder.retrievePokemonFromField();
		}

		// If the new tower slot has a pokemon in it 
		/// and it's not the same slot that we picked this pokemon up from, 
		// remove it from the slot.
		this.level.pokemonTowers = this.level.pokemonTowers.filter(tower => tower.towerSlot != newTowerSlot || this.heldTower.towerSlot == tower.towerSlot);

		// Remove the current held tower from the list of held towers and create a new one at the new slot.
		this.level.pokemonTowers.splice(this.level.pokemonTowers.indexOf(this.heldTower), 1)

		// Add a new tower if the towerSlot isn't null i.e. if the pokemon was placed on a tower slot
		if (newTowerSlot != null) {
			this.level.pokemonTowers.push(PokemonFactory.createPokemonTower(newTowerSlot, this.level, this.heldTower.pokemon))
		}
		this.heldTower.pokemon.place();
		this.heldTower.pokemon.renderGreyscale = false;

		this.heldTower = null;

		stateStack.pop();
	}

	handleMouseMove(event) {
		const x = event.offsetX / canvasScale;
		const y = event.offsetY / canvasScale;

		// Check if any pokemon is hovered over and at low health
		console.log("Moving Pokemon Tower");
		// If not hovering over a tower slot, render the pokemon in greyscale
		if (this.level.towerSlots.filter(slot => this.level.didMouseHitObject(x, y, slot)).length == 0) {
			this.heldTower.pokemon.renderGreyscale = true;
		}
		else {
			this.heldTower.pokemon.renderGreyscale = false;
		}

	}

}
