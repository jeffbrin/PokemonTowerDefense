import { getRandomPositiveInteger } from "../../../lib/RandomNumberHelpers.js";
import Vector from "../../../lib/Vector.js";
import Colour from "../../enums/Colour.js";
import FontName from "../../enums/FontName.js";
import { CANVAS_WIDTH, context, stateStack } from "../../globals.js";
import PokemonFactory from "../../services/PokemonFactory.js";
import Tile from "../../services/Tile.js";
import Background from "../../user-interface/Background.js";
import Panel from "../../user-interface/Panel.js";
import StateThatSaves from "../StateThatSaves.js";

export default class LoadingState extends StateThatSaves{

    static LEFTMOST_POKEMON_POSITION = {x: 3 * Tile.SIZE, y: 10 * Tile.SIZE};    

    constructor(message = "Loading...", attachLastStateEventListenersOnExit = true, callback = () => {}){
        super();
        this.callback = callback;
        this.jumpingPokemon = [
            PokemonFactory.createPokemon(getRandomPositiveInteger(1, 151), 10),
            PokemonFactory.createPokemon(getRandomPositiveInteger(1, 151), 10),
            PokemonFactory.createPokemon(getRandomPositiveInteger(1, 151), 10),
            PokemonFactory.createPokemon(getRandomPositiveInteger(1, 151), 10),
            PokemonFactory.createPokemon(getRandomPositiveInteger(1, 151), 10),
            PokemonFactory.createPokemon(getRandomPositiveInteger(1, 151), 10),
            PokemonFactory.createPokemon(getRandomPositiveInteger(1, 151), 10),
            PokemonFactory.createPokemon(getRandomPositiveInteger(1, 151), 10),
        ]
        this.jumpingPokemon.forEach((pokemon, index) => {
            pokemon.position.x = LoadingState.LEFTMOST_POKEMON_POSITION.x + Tile.SIZE * index * 2;
            pokemon.position.y =  LoadingState.LEFTMOST_POKEMON_POSITION.y;
        });
        this.jumpingPokemon = this.jumpingPokemon.map(pokemon => new JumpingPokemon(pokemon));

        this.nextPokemonJump(0);
        

        this.text = message;
        this.fontFamily = FontName.Pokemon;
		this.fontSize = 36;
		this.fontWeight = 'bold';

        this.background = new Background("lightblue");
        this.ground = new Panel(0, (LoadingState.LEFTMOST_POKEMON_POSITION.y + Tile.SIZE) / Tile.SIZE, CANVAS_WIDTH / Tile.SIZE, 10, {panelColour: "green", borderWidth: 0});

        this.attachLastStateEventListenersOnExit = attachLastStateEventListenersOnExit;
        
    }

    nextPokemonJump(index){
        this.jumpingPokemon[index].jump();

        if(index != this.jumpingPokemon.length - 1)
            setTimeout(() => {
                this.nextPokemonJump(index + 1)
            }, 590 / 7);
    }

    render(){
        this.background.render();
        this.ground.render();
        this.jumpingPokemon.forEach(pokemon => pokemon.render());
        this.renderText();
        
    }

    update(dt){
        this.jumpingPokemon.forEach(jumpingPokemon => jumpingPokemon.update(dt));
    }

    renderText()
	{
		context.save();

		context.fillStyle = Colour.Crimson;
		context.font = `${ this.fontSize }px ${ this.fontFamily }`;
		const lineWidth = context.measureText(this.text).width;
		context.fillText(this.text, CANVAS_WIDTH / 2 - lineWidth / 2, LoadingState.LEFTMOST_POKEMON_POSITION.y - Tile.SIZE * 6);

		context.restore();
	}

    exit(){
        super.exit();
        if(this.attachLastStateEventListenersOnExit)
            stateStack.states[stateStack.states.length - 2].attachEventListeners();
    }


}

class JumpingPokemon{

    static GRAVITY = 5;
    static JUMP_VELOCITY = -2;


    constructor(pokemon){
        this.bottomY = pokemon.position.y;
        this.pokemon = pokemon;
        this.position = this.pokemon.position;
        this.yVelocity = 0;
        this.hasJumped = false;
    }

    update(dt){
        if(!this.hasJumped)
            return;
        
        this.yVelocity += JumpingPokemon.GRAVITY * dt;
        this.position.y += this.yVelocity;
        if(this.position.y >= this.bottomY)
            this.jump();
    }

    render(){
        this.pokemon.render();
    }

    jump(){
        this.hasJumped = true;
        this.yVelocity = JumpingPokemon.JUMP_VELOCITY;
    }
}