import StateThatSaves from "../../StateThatSaves.js";
import { canvas, canvasScale, stateStack } from "../../../globals.js";
import Level from "../../../objects/Level.js";
import PokemonFactory from "../../../services/PokemonFactory.js";
import PartyMemberHolder from "../../../user-interface/PlayState/PartyMemberHolder.js";

export default class MovingPartyPokemonState extends StateThatSaves
{
	/**
	 * The main state used to play.
	 * @param {Level} level The selected level.
	 * @param {PartyMemberHolder} heldPartyMemberHolder The pokemon being moved
	 */
	constructor(level, heldPartyMemberHolder)
	{
		super();
		this.level = level;
		this.heldPartyMemberHolder = heldPartyMemberHolder;
		this.heldPartyMemberHolder.pokemon.pickup();

	}


	render()
	{
		this.level.render();
	}

	enter()
	{
		this.mousemoveCallback = (e) => this.handleMouseMove(e)
		canvas.addEventListener("mouseup", (e) => this.handleMouseUp(e), { once: true });
		canvas.addEventListener("mousemove", this.mousemoveCallback);
		this.level.pause();
	}

	exit(){
		super.exit();
		this.level.unpause();
		canvas.removeEventListener("mousemove", this.mousemoveCallback);
	}

	update(dt)
	{
		// this.level.update(dt);
		this.level.ui.update(dt);
	}

	handleMouseUp(event){
		this.heldPartyMemberHolder.pokemon.renderGreyscale = false;
		const x = event.offsetX / canvasScale;
        const y = event.offsetY / canvasScale;

		// Check if the pokemon was placed on a tower slot
            const hitTowers = this.level.towerSlots.filter(tower => this.level.didMouseHitObject(x, y, tower));

            // If placed on a new tower
            if(hitTowers.length == 1){
                const newTowerSlot = hitTowers[0]

				// If the new tower slot has a pokemon in it, put it back in the party.
                const replacedTower = this.level.pokemonTowers.filter(tower => tower.towerSlot == newTowerSlot)[0];
				if(replacedTower){
					const towerPokemonPartyHolder = this.level.ui.partyView.partyMemberHolders.filter(holder => holder.pokemon == replacedTower.pokemon)[0];
					towerPokemonPartyHolder.retrievePokemonFromField();
				}

                // If the new tower slot has a pokemon in it remove it from the slot.
                this.level.pokemonTowers = this.level.pokemonTowers.filter(tower => tower.towerSlot != newTowerSlot);

                // Remove the current held tower from the list of held towers and create a new one at the new slot.
                this.level.pokemonTowers.push(PokemonFactory.createPokemonTower(newTowerSlot, this.level, this.heldPartyMemberHolder.pokemon))

                // Let the party member holder know that its pokemon has been placed
                this.heldPartyMemberHolder.pokemonIsTower = true;
            }

            this.heldPartyMemberHolder.pokemon.place()
            this.heldPartyMemberHolder = null;

		stateStack.pop();
	}

	// Grey out pokemon unless it's over a tower
	handleMouseMove(event){
        const x = event.offsetX / canvasScale;
        const y = event.offsetY / canvasScale;

        // Check if any pokemon is hovered over and at low health
        // If not hovering over a tower slot, render the pokemon in greyscale
		if(this.level.towerSlots.filter(slot => this.level.didMouseHitObject(x, y, slot)).length == 0){
			this.heldPartyMemberHolder.pokemon.renderGreyscale = true;
		}
		else{
			this.heldPartyMemberHolder.pokemon.renderGreyscale = false;
		}

    }

}
