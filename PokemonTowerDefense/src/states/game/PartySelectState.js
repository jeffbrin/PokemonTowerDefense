import { isPointInObject } from "../../../lib/CollisionHelper.js";
import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Colour from "../../enums/Colour.js";
import { canvas, canvasScale, context, keys, stateStack } from "../../globals.js";
import Inventory from "../../objects/Inventory.js";
import Tile from "../../services/Tile.js";
import Background from "../../user-interface/Background.js";
import Button from "../../user-interface/Button.js";
import BoxParty from "../../user-interface/PartySelectState/BoxParty.js";
import CurrentTeamPanel from "../../user-interface/PartySelectState/CurrentTeamPanel.js";
import PartySelectPokemonBox from "../../user-interface/PartySelectState/PartySelectPokemonBox.js";
import StateThatSaves from "../StateThatSaves.js";
import LoadingState from "./LoadingState.js";
import PlayState from "./play/PlayState.js";
import PokemonFocusState from "./play/PokemonFocusState.js";

export default class PartySelectState extends StateThatSaves
{
    static READY_BUTTON = { x: 17, y: 15.25, width: 3, height: 1.5, text: "Ready" };
    static BACK_BUTTON = { x: 1, y: 15.25, width: 3, height: 1.5, text: "Back" };
    static FOCUS_MENU_CLICK_TIME = 0.1;
    constructor(pokemonInventory, level)
    {
        super();
        this.background = new Background();
        this.pokemonInventory = pokemonInventory;
        this.pokemonParty = pokemonInventory.party;
        this.level = level;
        this.currentTeamPanel = new CurrentTeamPanel(this.pokemonParty, this.background.colour, Colour.Gold);
        this.boxPokemon = pokemonInventory.box;
        this.boxPanel = new BoxParty(pokemonInventory.box);
        this.readyButton = new Button(PartySelectState.READY_BUTTON.x, PartySelectState.READY_BUTTON.y, PartySelectState.READY_BUTTON.width, PartySelectState.READY_BUTTON.height, PartySelectState.READY_BUTTON.text);
        this.backButton = new Button(PartySelectState.BACK_BUTTON.x, PartySelectState.BACK_BUTTON.y, PartySelectState.BACK_BUTTON.width, PartySelectState.BACK_BUTTON.height, PartySelectState.BACK_BUTTON.text);
        this.heldPokemon = null;
        this.textColour = Colour.White;
        this.fontSize = 26;

    }

    enter()
    {
        // Set to 100 so it doesn't open the focus by accident somehow
        this.timeSinceMouseDown = 100;
        this.mousemoveCallback = (e) => this.handleMouseMove(e);
        this.mouseDownListener = (e) => this.handleMouseDown(e);
        this.mouseUpCallback = (e) => this.handleMouseUp(e);
        this.attachEventListeners();
    }
    reenter()
    {
        super.reenter();
        this.pokemonInventory = Inventory.getInstance();
        this.pokemonParty = this.pokemonInventory.party;
        this.boxPokemon = this.pokemonInventory.box;
        this.boxPanel = new BoxParty(this.pokemonInventory.box);
        this.currentTeamPanel = new CurrentTeamPanel(this.pokemonParty, this.background.colour, Colour.Gold);

    }
    exit()
    {
        super.exit();
        this.removeEventListeners();
    }

    attachEventListeners()
    {
        super.attachEventListeners();
        canvas.addEventListener("mouseup", this.mouseUpCallback);
        canvas.addEventListener("mousemove", this.mousemoveCallback);
        canvas.addEventListener("mousedown", this.mouseDownListener);
    }

    removeEventListeners()
    {
        canvas.removeEventListener("mousemove", this.mousemoveCallback);
        canvas.removeEventListener("mousedown", this.mouseDownListener);
        canvas.removeEventListener("mouseup", this.mouseUpCallback);
    }

    async update(dt)
    {
        this.timeSinceMouseDown += dt;
        this.currentTeamPanel.update(dt);
        this.boxPanel.update(dt);
        if (this.heldPokemon)
        {
            this.heldPokemon.update(dt);
        }
    }

    render()
    {
        this.background.render();
        this.boxPanel.render();
        this.currentTeamPanel.render();

        if (this.heldPokemon)
            this.heldPokemon.render();

        this.renderText();
        this.readyButton.render();
        this.backButton.render();
    }

    async handleMouseDown(event)
    {
        this.timeSinceMouseDown = 0;

        // Loop through all clickables
        const x = event.offsetX / canvasScale;
        const y = event.offsetY / canvasScale;

        // play button
        if (isPointInObject(x, y, this.readyButton) && this.pokemonInventory.party.length > 0)
        {
            this.readyButton.onPress();
            this.removeEventListeners();

            // Pop this off
            stateStack.pop();

            // Add loading state while playstate is initialized
            stateStack.push(new LoadingState("Loading Level...", false));
            const playState = await PlayState.createPlaystate(this.level, this.pokemonInventory);

            // Pop loading state and push playstate
            stateStack.pop();
            stateStack.push(playState);

            return;
        }
        //back button
        if (isPointInObject(x, y, this.backButton))
        {
            console.log("Go Back");
            //TODO: back button functionality popping state
            this.removeEventListeners();
            this.backButton.onPress();

            // Attach the event listeners to the level state
            stateStack.states[stateStack.states.length - 2].attachEventListeners();
            stateStack.pop();
            return;
        }

        // Grab a box pokemon
        const pokemonBoxes = this.boxPanel.pokemonBoxes.filter(box => this.didMouseHitObject(x, y, box));
        if (pokemonBoxes.length == 1)
        {
            this.heldPokemon = pokemonBoxes[0].pokemon;
            this.oldHeldPokemonBox = pokemonBoxes[0];
            this.heldPokemon.pickup();
            return;
        }

        //Grab a partybox
        const partyBoxes = this.currentTeamPanel.pokemonBoxes.filter(box => isPointInObject(x, y, box));
        if (partyBoxes.length == 1)
        {
            this.heldPokemon = partyBoxes[0].pokemon;
            this.oldHeldPokemonBox = partyBoxes[0];
            this.heldPokemon.pickup();
        }

    }

    handleMouseUp(event)
    {
        if (!this.heldPokemon) return;

        // If it was a quick click, open the focus menu and return
        if (this.timeSinceMouseDown <= PartySelectState.FOCUS_MENU_CLICK_TIME)
        {
            stateStack.push(new PokemonFocusState(this.heldPokemon, null, this.pokemonInventory, true));
            this.removeEventListeners();
        }

        this.heldPokemon.renderGreyscale = false;
        const x = event.offsetX / canvasScale;
        const y = event.offsetY / canvasScale;


        // Check if the pokemon was placed on a box
        const boxes = this.boxPanel.pokemonBoxes.filter(box => this.didMouseHitObject(x, y, box));
        if (boxes.length === 1)
        {
            let pokemonToMove = null;
            //was a pokemon there??
            if (boxes[0].pokemon)
                pokemonToMove = boxes[0].pokemon;
            //place pokemon there
            const newPokemonSpot = boxes[0];

            // Add the replaced pokemon to the party box and the party itself
            this.oldHeldPokemonBox.pokemon = pokemonToMove ? pokemonToMove : null;

            newPokemonSpot.pokemon = this.heldPokemon;

            this.heldPokemon.place();



            //check array to remake it
            this.refactorParty();
            this.pokemonInventory.box = this.boxPanel.pokemonBoxes.map(box =>
            {
                if (box.pokemon)
                    return box.pokemon;
            });


            this.pokemonInventory.box = this.pokemonInventory.box.filter(pokemon => pokemon !== undefined);
            this.pokemonInventory.party = this.pokemonInventory.party.filter(pokemon => pokemon !== undefined && pokemon !== this.heldPokemon);
            this.heldPokemon = null;

        }

        //if placed in party
        const partyBoxes = this.currentTeamPanel.pokemonBoxes.filter(box => this.didMouseHitObject(x, y, box));
        if (partyBoxes.length === 1)
        {
            //place pokemon in party
            //Will probably have to place it in the first available slot even if its not what they chose
            //because of the way we set up the for loop in box panel and current team panel


            let pokemonToMove = null;
            //was a pokemon there??
            if (partyBoxes[0].pokemon) pokemonToMove = partyBoxes[0].pokemon;
            const newPokemonSpot = partyBoxes[0];

            pokemonToMove ? this.oldHeldPokemonBox.pokemon = pokemonToMove : this.oldHeldPokemonBox.pokemon = null;


            newPokemonSpot.pokemon = this.heldPokemon;

            this.heldPokemon.place();
            this.refactorParty();
            this.pokemonInventory.party = this.currentTeamPanel.pokemonBoxes.map(box =>
            {
                if (box.pokemon) return box.pokemon;
            });

            this.pokemonInventory.party = this.pokemonInventory.party.filter(pokemon => pokemon !== undefined);
            this.pokemonInventory.box = this.boxPanel.pokemonBoxes.filter(box => box.pokemon != undefined && box.pokemon !== this.heldPokemon).map(box => box.pokemon);

            this.heldPokemon = null;

        }

        if (boxes.length === 0 && partyBoxes.length === 0)
        {
            //TODO: put back in original spot
            this.oldHeldPokemonBox.pokemon = this.heldPokemon;
            this.heldPokemon.place();
            this.heldPokemon = null;
        }

    }
    refactorParty()
    {
        let pokemon = [];
        this.currentTeamPanel.pokemonBoxes.forEach((box, index) =>
        {
            if (box.pokemon !== null) pokemon.push(box.pokemon);
        });

        this.currentTeamPanel.pokemonBoxes.forEach((box, index) =>
        {
            if (pokemon[index]) this.currentTeamPanel.pokemonBoxes[index].pokemon = pokemon[index];
            else this.currentTeamPanel.pokemonBoxes[index].pokemon = null;
        });

        this.pokemonInventory.party = pokemon;
    }
    handleMouseMove(event)
    {
        const x = event.offsetX / canvasScale;
        const y = event.offsetY / canvasScale;


        //check if hovering over any of the buttons
        isPointInObject(x, y, this.readyButton) || this.pokemonInventory.party.length == 0 ? this.readyButton.onHover() : this.readyButton.onNoHover();
        isPointInObject(x, y, this.backButton) ? this.backButton.onHover() : this.backButton.onNoHover();


        if (!this.heldPokemon) return;

        // If not hovering over a box slot, render the pokemon in greyscale
        if (this.boxPanel.pokemonBoxes.filter(box => this.didMouseHitObject(x, y, box)).length == 0 &&
            this.currentTeamPanel.pokemonBoxes.filter(box => this.didMouseHitObject(x, y, box)).length == 0)
        {
            this.heldPokemon.renderGreyscale = true;
        }
        else
        {
            this.heldPokemon.renderGreyscale = false;
        }
    }
    didMouseHitObject(x, y, object)
    {
        return x >= object.position.x
            && x <= object.position.x + object.dimensions.x
            && y >= object.position.y
            && y <= object.position.y + object.dimensions.y;
    }
    renderText()
    {
        //harcoded stuff for now
        context.save();
        context.fillStyle = this.textColour;
        context.font = `${ this.fontSize }px`;
        context.fillText("Your Current Party:", 10, 10);


        context.fillText("How it works: ...", this.boxPanel.position.x, this.boxPanel.position.y - Tile.SIZE);



        context.restore();
    }
}