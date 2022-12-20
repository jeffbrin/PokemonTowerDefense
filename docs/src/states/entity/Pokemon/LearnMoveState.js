import { isPointInObject } from "../../../../lib/CollisionHelper.js";
import State from "../../StateThatSaves.js";
import Vector from "../../../../lib/Vector.js";
import Colour from "../../../enums/Colour.js";
import { canvas, canvasScale, CANVAS_HEIGHT, CANVAS_WIDTH, context, stateStack } from "../../../globals.js";
import AttackFactory from "../../../services/AttackFactory.js";
import Tile from "../../../services/Tile.js";
import Button from "../../../user-interface/Button.js";
import Panel from "../../../user-interface/Panel.js";
import AttackDescriptionPanel from "../../../user-interface/PokemonFocusState/AttackDescriptionPanel.js";
import AttacksPanel from "../../../user-interface/PokemonFocusState/AttacksPanel.js";


export default class LearnMoveState extends State{

    static MESSAGE_BOX_DIMENSIONS = {width: 16, height: 8}
    static STATE = {
        ReplaceOrNot: 0,
        ReplacementPick: 1,
        AreYouSure: 2,
        MoveAdded: 3
    }

    constructor(pokemon, newMove, callback = () => {}){
        super();
        this.pokemon = pokemon;
        this.newMove = newMove;
        this.callback = callback;
        this.selectedReplacement = this.pokemon.selectedAttack;

        // Store the selected index so that it can go back to that index when this state is done.
        this.originalSelectionIndex = 0
        this.pokemon.attacks.forEach((attack, index) => {
            if(attack == this.pokemon.selectedAttack)
                this.originalSelectionIndex = index;
        })

        // Set the default state and description
        this.currentState = LearnMoveState.STATE.ReplaceOrNot;
        this.replaceOrNotDescription = `${pokemon.name} wants to learn ${newMove.name}.\nWould you like to replace an old move to learn it?`
        this.description = this.replaceOrNotDescription;

        // If the move should be auto learned
        if(this.pokemon.attacks.length < 4){
            this.pokemon.attacks.push(AttackFactory.createAttack(newMove.name));
            this.currentState = LearnMoveState.STATE.MoveAdded;
            this.description = `${pokemon.name} learned ${newMove.name}!`;
        }

        const MESSAGE_BOX_POSITION = {
            x: (CANVAS_WIDTH / 2) / Tile.SIZE - LearnMoveState.MESSAGE_BOX_DIMENSIONS.width / 2,
            y: (CANVAS_HEIGHT / 2) / Tile.SIZE - LearnMoveState.MESSAGE_BOX_DIMENSIONS.height / 2
        }

        // Create some of the ui elements
        this.background = new Panel(MESSAGE_BOX_POSITION.x, MESSAGE_BOX_POSITION.y, LearnMoveState.MESSAGE_BOX_DIMENSIONS.width, LearnMoveState.MESSAGE_BOX_DIMENSIONS.height, {panelColour: Colour.Black, borderColour: Colour.Transparent});
        this.attackPanels = new AttacksPanel(pokemon, MESSAGE_BOX_POSITION.x / Tile.SIZE + 7, MESSAGE_BOX_POSITION.y / Tile.SIZE + 2.25 + AttackDescriptionPanel.DIMENSIONS.y);
        this.blackoutBackground = new Panel(0, 0, CANVAS_WIDTH / Tile.SIZE, CANVAS_HEIGHT / Tile.SIZE, {borderWidth: 0, panelColour: "rgba(0, 0, 0, 0.9)", borderColour: Colour.Transparent})
        this.selectedReplacementDescriptionPanel = new AttackDescriptionPanel(this.pokemon, MESSAGE_BOX_POSITION.x + 2.5, MESSAGE_BOX_POSITION.y + 2.25 + AttackDescriptionPanel.DIMENSIONS.y);
        this.newMoveDescriptionPanel = new AttackDescriptionPanel({selectedAttack: newMove}, MESSAGE_BOX_POSITION.x + 2.5, MESSAGE_BOX_POSITION.y + 2.25 - AttackDescriptionPanel.DIMENSIONS.y);

        // Add buttons
        this.yesButton = new Button(MESSAGE_BOX_POSITION.x + LearnMoveState.MESSAGE_BOX_DIMENSIONS.width / 2 + 1, MESSAGE_BOX_POSITION.y + LearnMoveState.MESSAGE_BOX_DIMENSIONS.height - 1.5, 2, 1, "Yes");
        this.noButton = new Button(MESSAGE_BOX_POSITION.x + LearnMoveState.MESSAGE_BOX_DIMENSIONS.width / 2 - 3, MESSAGE_BOX_POSITION.y + LearnMoveState.MESSAGE_BOX_DIMENSIONS.height - 1.5, 2, 1, "No")
        
        this.attachEventListeners();
    }

    update(dt){
        this.pokemon.update(dt);

        // Set on click functions for each state
        if(this.currentState == LearnMoveState.STATE.ReplaceOrNot){
            this.noButton.onClick = () => {this.currentState = LearnMoveState.STATE.AreYouSure; this.description = `Are you sure you want to give up\non learning ${this.newMove.name}?`; this.selectedReplacement = null;}
            this.yesButton.onClick = () => {
                this.currentState = LearnMoveState.STATE.ReplacementPick; 
                this.yesButton.position.y += AttackDescriptionPanel.DIMENSIONS.y * Tile.SIZE; 
                this.noButton.position.y += AttackDescriptionPanel.DIMENSIONS.y * Tile.SIZE}    
        }
        else if (this.currentState == LearnMoveState.STATE.ReplacementPick){
            this.renderDescription();
            this.yesButton.onClick = () => {
                this.currentState = LearnMoveState.STATE.AreYouSure; 
                this.description = `Are you sure you want to replace\n${this.selectedReplacement.name} with ${this.newMove.name}?`
                this.yesButton.position.y -= AttackDescriptionPanel.DIMENSIONS.y * Tile.SIZE; 
                this.noButton.position.y -= AttackDescriptionPanel.DIMENSIONS.y * Tile.SIZE;
            }
            this.noButton.onClick = () => {
                this.currentState = LearnMoveState.STATE.AreYouSure; 
                this.description = `Are you sure you want to give up\non learning ${this.newMove.name}?`; 
                this.selectedReplacement = null;
                this.yesButton.position.y -= AttackDescriptionPanel.DIMENSIONS.y * Tile.SIZE; 
                this.noButton.position.y -= AttackDescriptionPanel.DIMENSIONS.y * Tile.SIZE;
            }
            }
        else if(this.currentState == LearnMoveState.STATE.AreYouSure){
            this.noButton.onClick = () => {this.currentState = LearnMoveState.STATE.ReplaceOrNot; this.description = this.replaceOrNotDescription}
            
            // This will work even for the are you sure situation coming from ReplaceOrNot because if selectedReplacement is null, nothing will be replaced.
            this.yesButton.onClick = () => {
                this.pokemon.attacks.forEach((attack, index) => {
                if(attack == this.selectedReplacement)
                    this.pokemon.attacks[index] = this.newMove;
                });
                stateStack.pop();
                this.callback();
        }  
        }
    }

    render(){
        context.save();
        if(this.currentState == LearnMoveState.STATE.ReplaceOrNot || this.currentState == LearnMoveState.STATE.AreYouSure){

            // Background and panel
            this.background.render();
            this.renderPokemon();

            
            // Description text ("X wants to learn y move...")
            this.renderDescription();

            // Buttons
            this.yesButton.render();
            this.noButton.render();
            
        }
        else if(this.currentState == LearnMoveState.STATE.ReplacementPick){
            this.blackoutBackground.render();
            this.attackPanels.render();
            this.selectedReplacementDescriptionPanel.render();
            this.newMoveDescriptionPanel.render();
            this.renderDescription(-6, -7 * Tile.SIZE)
            this.yesButton.render();
            this.noButton.render();
        }
        else if (this.currentState == LearnMoveState.STATE.MoveAdded){
            this.background.render();
            this.renderDescription();
            this.renderPokemon();
        }

        context.restore();
    }

    enter(){
        stateStack.states[stateStack.states.length - 2].removeEventListeners();
    }

    exit(){
        stateStack.states[stateStack.states.length - 2].attachEventListeners();
        this.removeEventListeners();
        this.pokemon.selectedAttack = this.pokemon.attacks[this.originalSelectionIndex];
    }

    attachEventListeners(){
        this.mousemoveListener = (e) => this.manageMouseMove(e);
        this.mousedownListener = (e) => this.manageMouseDown(e);
        canvas.addEventListener("mousemove", this.mousemoveListener);
        canvas.addEventListener("mousedown", this.mousedownListener);
    }

    removeEventListeners(){
        canvas.removeEventListener("mousemove", this.mousemoveListener);
        canvas.removeEventListener("mousedown", this.mousedownListener);
    }

    manageMouseMove(e){
        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        // Yes button
        if(isPointInObject(x, y, this.yesButton)){
            this.yesButton.onHover();
        }
        else
            this.yesButton.onNoHover();

        // No button
        if(isPointInObject(x, y, this.noButton)){
            this.noButton.onHover();
        }
        else
            this.noButton.onNoHover();
    }

    manageMouseDown(e){
        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        // Yes button
        if(isPointInObject(x, y, this.yesButton)){
            this.yesButton.onClick();
        }

        // No button
        if(isPointInObject(x, y, this.noButton)){
            this.noButton.onClick();
        }

        // Pop when the move has been added and there is a click
        if(this.currentState == LearnMoveState.STATE.MoveAdded){
            stateStack.pop();
            this.callback();
        }

        // Pick a move in the pick replacement state
        if(this.currentState == LearnMoveState.STATE.ReplacementPick){
            const pickedButton = this.attackPanels.attackButtons.filter(button => isPointInObject(x, y, button))[0];
            if(pickedButton){
                const pickThisAttack = (attack) => this.selectedReplacement = attack;
                this.attackPanels.attackButtons.forEach(button => {
                    button.panelColour = Colour.Black;
                    if(isPointInObject(x, y, button)){
                        pickThisAttack(button.attack);
                        button.onClick();
                        this.selectedReplacement = button.attack;
                    }
                })
            }
        }
    }

    renderDescription(xOffset = 0, yOffset = 0){
        context.fillStyle = "White";
            context.font = "12px Joystix";
            const fontSize = 12;

            this.description.split("\n").forEach((line, index) => {
                const textWidth = context.measureText(line).width;
                context.fillText(
                    line,
                    this.background.position.x + (this.background.dimensions.x - textWidth) / 2 + xOffset,
                    this.background.position.y + 4 * Tile.SIZE + index * fontSize + yOffset,
                )
            })
    }

    renderPokemon(){
        this.pokemon.render(new Vector((CANVAS_WIDTH / 2) - 0.5 * Tile.SIZE, (CANVAS_HEIGHT / 2) - 2.5 * Tile.SIZE));
    }

}