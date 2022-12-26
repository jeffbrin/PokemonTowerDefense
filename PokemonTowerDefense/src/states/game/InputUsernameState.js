import { isPointInObject } from "../../../lib/CollisionHelper.js";
import Colour from "../../enums/Colour.js";
import { canvas, canvasScale, CANVAS_HEIGHT, CANVAS_WIDTH, context, keys, setUsername, stateStack } from "../../globals.js";
import Tile from "../../services/Tile.js";
import Background from "../../user-interface/Background.js";
import Button from "../../user-interface/Button.js";
import Panel from "../../user-interface/Panel.js";
import StateThatSaves from "../StateThatSaves.js";
import InputBox from "./InputBox.js";
import StarterPokemonSelectState from "./StarterPokemonSelectState.js";
import { arraysEqual }from "../../../lib/MoreEquals.js"
import PlayState from "./play/PlayState.js";

export default class InputUsernameState extends StateThatSaves{

    static DIMENSIONS = {width: 12, height: 5}
    static MAX_NAME_LENGTH = 20;

    constructor(){
        super();
        this.background = new Background("rgba(0, 0, 0, 0.85)")
        this.panel = new Panel(CANVAS_WIDTH / 2 / Tile.SIZE - InputUsernameState.DIMENSIONS.width / 2, CANVAS_HEIGHT / 2 / Tile.SIZE - InputUsernameState.DIMENSIONS.height / 2, InputUsernameState.DIMENSIONS.width, InputUsernameState.DIMENSIONS.height, {panelColour: Colour.Black, borderColour: Colour.Crimson})
        this.inputPanel = new InputBox(
            this.panel.position.x / Tile.SIZE + InputUsernameState.DIMENSIONS.width / 6, 
            this.panel.position.y / Tile.SIZE + InputUsernameState.DIMENSIONS.height * 0.6,
            InputUsernameState.DIMENSIONS.width * 2 / 3,
            1,
            InputUsernameState.MAX_NAME_LENGTH,
            () => this.notifyBadName(["Name can not exceed", `${InputUsernameState.MAX_NAME_LENGTH} characters.`]))
        this.button = new Button(this.panel.position.x / Tile.SIZE + InputUsernameState.DIMENSIONS.width / 4, this.panel.position.y / Tile.SIZE + InputUsernameState.DIMENSIONS.height + 0.25, InputUsernameState.DIMENSIONS.width / 2, 2, "Confirm");

        // Check render text and notifyBadName to see why this is an array 
        this.questionText = ["What is your name?"];
        this.fontSize = Panel.FONT_SIZE;
		this.fontColour = Colour.White;
		this.fontFamily = Panel.FONT_FAMILY;

        this.mouseMoveListener = (e) => this.handleMouseMove(e);
        this.mouseDownListener = (e) => this.handleMouseDown(e);
        this.attachEventListeners();
    }

    enter(){

        // https://www.geeksforgeeks.org/how-to-detect-whether-the-website-is-being-opened-in-a-mobile-device-or-a-desktop-in-javascript/
        /* Storing user's device details in a variable*/
        let details = navigator.userAgent;
  
        /* Creating a regular expression 
        containing some mobile devices keywords 
        to search it in details string*/
        let regexp = /android|iphone|kindle|ipad/i;
  
        /* Using test() method to search regexp in details
        it returns boolean value*/
        let isMobileDevice = regexp.test(details);

        if (isMobileDevice)
            prompt("This is a workaround to open mobile keyboards. Close this prompt.");
    }

    update(dt){
        this.inputPanel.update(dt);

        if(keys['Enter']){
            this.enterName();
            keys['Enter'] = false;
        }
    }

    render(){
        super.render();
        this.background.render();
        this.panel.render();
        this.inputPanel.render();
        this.renderText();
        this.button.render();
    }

    renderText()
	{
		context.textBaseline = 'top';
		context.font = `${ this.fontSize }px ${ this.fontFamily }`;
		context.fillStyle = this.fontColour;

        if(this.questionText.length == 0){
            const lineWidth = context.measureText(this.questionText).width;
            const marginToCenter = (this.panel.dimensions.x - lineWidth) / 2
            context.fillText(this.questionText, this.panel.position.x + marginToCenter, this.panel.position.y + 1 * Tile.SIZE);
        }
        else
            this.questionText.forEach((line, index) => {
                const lineWidth = context.measureText(line).width;
                const marginToCenter = (this.panel.dimensions.x - lineWidth) / 2
                context.fillText(line, this.panel.position.x + marginToCenter, this.panel.position.y + 1 * Tile.SIZE + this.fontSize * index);
            });

    }

    attachEventListeners(){
        super.attachEventListeners();
        canvas.addEventListener("mousemove", this.mouseMoveListener);
        canvas.addEventListener("mousedown", this.mouseDownListener);
    }

    removeEventListeners(){
        super.removeEventListeners();
        canvas.removeEventListener("mousemove", this.mouseMoveListener);
        canvas.removeEventListener("mousedown", this.mouseDownListener);
    }

    handleMouseMove(e){
        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        if(isPointInObject(x, y, this.button)){
            this.button.onHover();
        }
        else{
            this.button.onNoHover();
        }
    }
    
    handleMouseDown(e){
        const x = e.offsetX / canvasScale;
        const y = e.offsetY / canvasScale;

        if(isPointInObject(x, y, this.button)){
            this.enterName();
        }
    }

    notifyBadName(text = ["You may not enter", "an empty name."]){

        // Spamming this was causing bugs.
        if (arraysEqual(text, this.questionText))
            return;

        const oldText = this.questionText;
        const oldColour = this.fontColour;
        this.questionText = text;
        this.fontColour = Colour.Crimson;
        setTimeout(() => {
            this.questionText = oldText;
            this.fontColour = oldColour;
        }, 1000);
    }

    async enterName(){
        if(!this.inputPanel.playerInput)
            this.notifyBadName();
        else{
            setUsername(this.inputPanel.playerInput);
            stateStack.pop();
            stateStack.push(new StarterPokemonSelectState())
        }
    }

}