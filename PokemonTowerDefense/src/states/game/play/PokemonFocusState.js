import StateThatSaves from "../../StateThatSaves.js";
import { canvas, canvasScale, CANVAS_HEIGHT, keys, sounds, stateStack } from "../../../globals.js";
import AttackButton from "../../../user-interface/PokemonFocusState/AttackButton.js";
import PokemonFocusUI from "../../../user-interface/PokemonFocusState/PokemonFocusUI.js";
import AreYouSureState from "../../AreYouSureState.js";

export default class PokemonFocusState extends StateThatSaves
{

    /**
     * Creates a state where a player can check out their pokemon and select their desired attack.
     * @param {Pokemon} pokemon The pokemon to focus on.
     * @param {Level} level The level currently playing.
     * @param {Inventory} inventory The inventory of the player
     */
    constructor(pokemon, level, inventory, allowRelease = false)
    {
        super();
        this.pokemon = pokemon;
        this.level = level;
        this.inventory = inventory;
        this.allowRelease = allowRelease;

        this.ui = new PokemonFocusUI(this.pokemon, inventory, this.allowRelease);

        this.mouseDownListener = (e) => this.manageMouseDown(e);
        this.mouseMoveListener = (e) => this.manageMouseMove(e);
        this.attachEventListeners();
    }

    enter()
    {
        // Play this pokemon's sound
        sounds.play(this.pokemon.crySoundName);
    }

    update(dt)
    {
        this.ui.update(dt);

        // Allow the user to leave by clicking escape
        if (keys.Escape)
        {
            stateStack.pop();
            keys.Escape = false;
        }
    }

    render()
    {
        this.ui.render();
    }
    reenter()
    {
        super.reenter();
        this.attachEventListeners();

    }

    exit()
    {
        super.exit();
        if (this.level)
            this.level.unpause();
        this.removeEventListeners();

        // Reattach playstate event listeners
        // Only works because the next state is always the playstate.
        stateStack.states[stateStack.states.length - 2].attachEventListeners();
    }

    manageMouseDown(e)
    {
        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        if (this.didHitObject(x, y, this.ui.closeButton))
            stateStack.pop();

        // Check if any of the attacks were hit.
        if (this.ui.attacksPanel.attackButtons.filter(ab => this.didHitObject(x, y, ab)).length > 0)
        {
            this.ui.attacksPanel.attackButtons.forEach(attackButton => { attackButton.panelColour = AttackButton.UNSELECTED_COLOUR; });
            this.ui.attacksPanel.attackButtons.forEach(attackButton =>
            {
                if (this.didHitObject(x, y, attackButton))
                {
                    attackButton.onClick();
                }
            });
        }

        // Check if the level up button was pressed
        if (this.didHitObject(x, y, this.ui.levelUpButton))
        {
            this.ui.levelUpButton.onClick(this);
        }

        if (this.allowRelease)
        {
            //Release Pokemon Button
            if (this.didHitObject(x, y, this.ui.releasePokemonButton))
            {
                if (this.inventory.party.length <= 1 && this.inventory.box.length === 0) return;

                this.removeEventListeners();
                this.ui.releasePokemonButton.onNoHover();
                stateStack.push(new AreYouSureState(this.pokemon));
            }
        }


    }

    manageMouseMove(e)
    {
        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        // Close button
        if (this.didHitObject(x, y, this.ui.closeButton))
        {
            this.ui.closeButton.onHover();
        }
        else
        {
            this.ui.closeButton.onNoHover();
        }

        // Level up button
        if (this.didHitObject(x, y, this.ui.levelUpButton))
        {
            this.ui.levelUpButton.onHover();
        }
        else
        {
            this.ui.levelUpButton.onNoHover();
        }

        if (this.allowRelease)
        {
            //Release Pokemon Button
            if (this.didHitObject(x, y, this.ui.releasePokemonButton))
            {
                this.ui.releasePokemonButton.onHover();
            }
            else
            {
                this.ui.releasePokemonButton.onNoHover();
            }
        }

    }

    didHitObject(x, y, object)
    {
        return x >= object.position.x &&
            x <= object.position.x + object.dimensions.x &&
            y >= object.position.y &&
            y <= object.position.y + object.dimensions.y;

    }

    removeEventListeners()
    {
        super.removeEventListeners();
        canvas.removeEventListener("mousedown", this.mouseDownListener);
        canvas.removeEventListener("mousemove", this.mouseMoveListener);
    }

    attachEventListeners()
    {
        super.attachEventListeners();
        canvas.addEventListener("mousedown", this.mouseDownListener);
        canvas.addEventListener("mousemove", this.mouseMoveListener);
    }

}