import StateThatSaves from "../../StateThatSaves.js";
import Vector from "../../../../lib/Vector.js";
import { canvas, keys, stateStack, canvasScale, playBackgroundMusic, getHighestUnlockedLevel, setHighestUnlockedLevel, sounds } from "../../../globals.js";
import Level from "../../../objects/Level.js";
import Panel from "../../../user-interface/Panel.js";
import CutSceneState from "../CutSceneState.js";
import DialogueBoxState from "../DialogBoxState.js";
import TweeningState from "../TweeningState.js";
import CutScenePerson from "../../../objects/CutScenePerson.js";
import ImageName from "../../../enums/ImageName.js";
import LevelFactory from "../../../services/LevelFactory.js";
import MovingPartyPokemonState from "./MovingPartyPokemonState.js";
import MovingTowerState from "./MovingTowerState.js";
import CatchingState from "./CatchingState.js";
import PokemonFocusState from "./PokemonFocusState.js";
import Inventory from "../../../objects/Inventory.js";
import TransitionState from "../TransitionState.js";
import StarterPokemonSelectState from "../StarterPokemonSelectState.js";
import SoundName from "../../../enums/SoundName.js";
import { isPointInObject } from "../../../../lib/CollisionHelper.js";

export default class PlayState extends StateThatSaves
{

	static CREATE_PLAYSTATE_CALLED = false;

	/**
	 * The main state used to play.
	 * @param {Level} level The selected level.
	 * @param {Inventory} inventory The player's inventory.
	 */
	constructor(level, inventory, preventCutsceneOnFirstEnter = false)
	{
		super();

		// This is specifically here for the starter pokemon select state
		this.preventCutsceneOnFirstEnter = preventCutsceneOnFirstEnter;

		// Can not call constructor directly
		if (!PlayState.CREATE_PLAYSTATE_CALLED)
			throw Error("Do not call the Level constructor directly... use PlayState.createPlayState() instead.");

		this.level = level;
		this.inventory = inventory;
		PlayState.CREATE_PLAYSTATE_CALLED = false;

		this.victoryCutscene = this.level.victoryCutscene ?? new CutSceneState([(callback) => {callback()}]);
		this.lossCutscene = this.level.lossCutscene ?? new CutSceneState([(callback) => {callback()}]);
		this.introCutscene = this.level.introCutscene;

		// Add a fade out / pop to the loss and victory cutscenes
		this.lossCutscene.callbacks.push((callback) => {TransitionState.fade(() =>
			{
				// Pop the playstate off
				stateStack.pop();
				stateStack.pop();

				// Attach event listeners to the level select state.
				stateStack.top().attachEventListeners();
				callback();
			});})
		this.victoryCutscene.callbacks.push((callback) => {TransitionState.fade(() =>
			{
				// Pop the playstate off
				stateStack.pop();
				stateStack.pop();

				// Attach event listeners to the level select state.
				stateStack.top().attachEventListeners();
				callback();
			});})
	}

	/**
	 * Creates a playstate.
	 * @param {Number} levelNumber The number of the level.
	 * @param {Inventory} inventory The inventory.
	 * @param {Bool} preventCutsceneOnFirstEnter This should only be true on the very first time of the very first level - When the player gets their starter pokemon.
	 * @returns A promise which resolves with a PlayState
	 */
	static async createPlaystate(levelNumber = 1, inventory = Inventory.getInstance(), preventCutsceneOnFirstEnter = false)
	{
		PlayState.CREATE_PLAYSTATE_CALLED = true;
		return new PlayState(await LevelFactory.createLevel(levelNumber, inventory), inventory, preventCutsceneOnFirstEnter);
	}

	render()
	{
		this.level.render();
	}

	enter()
	{
		this.mouseDownListener = (e) => this.handleMouseDown(e);
		this.mouseMoveListener = (e) => this.handleMouseMove(e);
		
		// Push the intro cutscene and add the music to the end of it
		this.level.introCutscene.callbacks.push((callback) => 
		{
			playBackgroundMusic(SoundName.Battle); 
			this.attachEventListeners();
			callback();
		});

		if (!this.preventCutsceneOnFirstEnter)
			stateStack.push(this.level.introCutscene);
		this.preventCutsceneOnFirstEnter = false;
	}

	exit()
	{
		super.exit();
		// Remove the listeners so they doesn't persist until the next playstate
		this.removeEventListeners();
	}

	update(dt)
	{

		this.level.update(dt);

		// If the player lost
		if (this.level.lostLevel())
		{
			stateStack.push(this.lossCutscene);
			this.removeEventListeners();
		}

		// If the player won
		if (this.level.wonLevel())
		{
			stateStack.push(this.victoryCutscene);
			// Increase the max unlocked level if this is the highest level the player has beaten
			if(getHighestUnlockedLevel() == this.level.levelNumber){
				setHighestUnlockedLevel(this.level.levelNumber+1);
				this.inventory.pokeballCount += this.level.pokeballsProvided;
			}

			this.removeEventListeners();

		}
	}

	preventPokemonSpawning(){

	}


	handleMouseDown(event)
	{
		// Loop through all clickables
		const x = event.offsetX / canvasScale;
		const y = event.offsetY / canvasScale;

		// Grab a placed tower
		const hitTowers = this.level.pokemonTowers.filter(tower => this.level.didMouseHitObject(x, y, tower.towerSlot));
		if (hitTowers.length == 1)
		{
			stateStack.push(new MovingTowerState(this.level, hitTowers[0]));
		}

		// Grab a party member
		const hitPartyPokemon = this.level.ui.partyView.partyMemberHolders.filter(holder => this.level.didMouseHitObject(x, y, holder));
		if (hitPartyPokemon.length == 1 && hitPartyPokemon[0].pokemon)
		{
			this.level.pause();
			// If the pokemon is already placed, pick up the tower, not the holder
			if (hitPartyPokemon[0].pokemonIsTower)
			{
				stateStack.push(new PokemonFocusState(hitPartyPokemon[0].pokemon, this.level, this.level.inventory));

				// Remove the event listener so the player can't mess with this state in the focus state.
				this.removeEventListeners();
			}
			// If the pokemon is not alreayd placed, pick up the pokemon from the party
			else
			{
				const heldPartyMemberHolder = hitPartyPokemon[0];
				stateStack.push(new MovingPartyPokemonState(this.level, heldPartyMemberHolder));
			}
		}

		// Grab the pokeball
		if (this.level.didMouseHitObject(x, y, this.level.ui.pokeball) && this.inventory.pokeballCount > 0)
		{
			stateStack.push(new CatchingState(this.level));
		}

		// Run
		if (isPointInObject(x, y, this.level.ui.runButton)){
			sounds.play(SoundName.Run);
			TransitionState.fade( () => {
					stateStack.pop()
				}
			);
			
		}

	}

	handleMouseMove(e){
		const x = e.offsetX / canvasScale;
		const y = e.offsetY / canvasScale;

		// Run Button
		if (isPointInObject(x, y, this.level.ui.runButton)){
			this.level.ui.runButton.onHover();
		}
		else{
			this.level.ui.runButton.onNoHover();
		}
	}

	reenter(){
		super.reenter();
	}

	attachEventListeners()
	{
		super.attachEventListeners();
		canvas.addEventListener("mousedown", this.mouseDownListener);
		canvas.addEventListener("mousemove", this.mouseMoveListener);
		this.level.unpause();
	}

	removeEventListeners(){
		super.removeEventListeners();
		canvas.removeEventListener("mousedown", this.mouseDownListener);
		canvas.removeEventListener("mousemove", this.mouseMoveListener);
		this.level.pause();
	}

}
