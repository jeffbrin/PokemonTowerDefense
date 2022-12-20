import { isPointInObject } from "../../../lib/CollisionHelper.js";
import StateThatSaves from "../StateThatSaves.js";
import Colour from "../../enums/Colour.js";
import FontName from "../../enums/FontName.js";
import { canvas, canvasScale, CANVAS_HEIGHT_IN_TILES, CANVAS_WIDTH, CANVAS_WIDTH_IN_TILES, context, getUsername, playBackgroundMusic, pokemonFactory, stateStack } from "../../globals.js";
import { loadData } from "../../services/SaveAndLoad.js";
import Tile from "../../services/Tile.js";
import Background from "../../user-interface/Background.js";
import Button from "../../user-interface/Button.js";
import ImagePanel from "../../user-interface/TitleScreenState/ImagePanel.js";
import LevelSelectState from "./LevelSelectState.js";
import PokemonFactory from "../../services/PokemonFactory.js";
import { getRandomPositiveInteger } from "../../../lib/RandomNumberHelpers.js";
import Vector from "../../../lib/Vector.js";
import Direction from "../../enums/Direction.js";
import Panel from "../../user-interface/Panel.js";
import PokedexNumber from "../../enums/PokedexNumber.js";
import Inventory from "../../objects/Inventory.js";
import SoundName from "../../enums/SoundName.js";
import InputUsernameState from "./InputUsernameState.js";

export default class TitleScreenState extends StateThatSaves
{
	static START_BUTTON = {
		x: CANVAS_WIDTH_IN_TILES / 2 - 5 / 2,
		y: CANVAS_HEIGHT_IN_TILES / 2 + 2.5,
		width: 5,
		height: 2.5,
		text: "Start"
	};
	static IMAGE_PANEL = {
		x: CANVAS_WIDTH_IN_TILES / 2 - 10 / 2,
		y: CANVAS_HEIGHT_IN_TILES / 8,
		width: 10,
		height: 14
	};
	static LEFT_BORDER = {
		x: 0,
		y: 0,
		width: 5.5,
		height: 17
	};
	static RIGHT_BORDER = {
		x: TitleScreenState.IMAGE_PANEL.x + TitleScreenState.IMAGE_PANEL.width,
		y: 0,
		width: 5.5,
		height: 17
	};
	static POKEMON_WALK_SPEED = 50;
	constructor()
	{
		super();
		this.background = new Background();
		this.startButton = new Button(TitleScreenState.START_BUTTON.x, TitleScreenState.START_BUTTON.y, TitleScreenState.START_BUTTON.width, TitleScreenState.START_BUTTON.height, TitleScreenState.START_BUTTON.text);
		this.imagePanel = new ImagePanel(TitleScreenState.IMAGE_PANEL.x, TitleScreenState.IMAGE_PANEL.y, TitleScreenState.IMAGE_PANEL.width, TitleScreenState.IMAGE_PANEL.height, null, { panelColour: Colour.Black, borderColour: Colour.Crimson, borderWidth: 5 });
		this.imagePanelFrame = new ImagePanel(TitleScreenState.IMAGE_PANEL.x, TitleScreenState.IMAGE_PANEL.y, TitleScreenState.IMAGE_PANEL.width, TitleScreenState.IMAGE_PANEL.height, null, { panelColour: Colour.Transparent, borderColour: Colour.Crimson, borderWidth: 0, fill: false, stroke: true, strokeWidth: 1000 });
		this.leftBorder = new Panel(TitleScreenState.LEFT_BORDER.x, TitleScreenState.LEFT_BORDER.y, TitleScreenState.LEFT_BORDER.width, TitleScreenState.LEFT_BORDER.height, { panelColour: this.background.colour, borderWidth: 0 });
		this.rightBorder = new Panel(TitleScreenState.RIGHT_BORDER.x, TitleScreenState.RIGHT_BORDER.y, TitleScreenState.RIGHT_BORDER.width, TitleScreenState.RIGHT_BORDER.height, { panelColour: this.background.colour, borderWidth: 0 });
		this.fontFamily = FontName.Pokemon;
		this.fontSize = 36;
		this.fontWeight = 'bold';
		this.pokemonLines = [];
		this.addPokemonLine();
	}
	enter()
	{
		loadData();
		this.mousemoveCallback = (e) => this.handleMouseMove(e);
		this.mouseUpCallback = (e) => this.handleMouseUp(e);
		this.mouseDownListener = (e) => this.handleMouseDown(e);
		this.attachEventListeners();
	}

	exit()
	{
		super.exit();
		this.removeEventListeners();
	}

	update(dt)
	{

		// Tweening in update because I don't want the tween to persist in the timer after closing this state
		this.pokemonLines.forEach(pokemonLine =>
		{
			pokemonLine.forEach(pokemon =>
			{
				pokemon.update(dt);
				pokemon.position.x += TitleScreenState.POKEMON_WALK_SPEED * dt;
			});
		});

		// Filter out lines that have moved all the way to the right
		this.pokemonLines.filter(line => line[0].position.x < TitleScreenState.RIGHT_BORDER.x);

		// Add another line when there's room
		if (this.pokemonLines[this.pokemonLines.length - 1][0].position.x >= TitleScreenState.IMAGE_PANEL.x * Tile.SIZE + Tile.SIZE)
			this.addPokemonLine();

	}

	addPokemonLine()
	{
		const new_line = [];
		for (let i = 0; i < TitleScreenState.IMAGE_PANEL.height / 1.5 - 1; i++)
		{
			const pokemon = PokemonFactory.createPokemon(getRandomPositiveInteger(1, 151), 100);
			pokemon.direction = Direction.RIGHT;
			pokemon.position = new Vector((TitleScreenState.IMAGE_PANEL.x - 1) * Tile.SIZE, (TitleScreenState.IMAGE_PANEL.y + i) * Tile.SIZE * 1.5 - 2);
			new_line.push(pokemon);
		}
		this.pokemonLines.push(new_line);
	}

	removeEventListeners()
	{
		canvas.removeEventListener("mouseup", this.mouseUpCallback);
		canvas.removeEventListener("mousemove", this.mousemoveCallback);
		canvas.removeEventListener("mousedown", this.mouseDownListener);
	}

	attachEventListeners()
	{
		super.attachEventListeners();
		canvas.addEventListener("mouseup", this.mouseUpCallback);
		canvas.addEventListener("mousemove", this.mousemoveCallback);
		canvas.addEventListener("mousedown", this.mouseDownListener);
		playBackgroundMusic(SoundName.Title)
	}

	render()
	{
		this.background.render();
		this.imagePanel.render();

		this.pokemonLines.forEach(pokemonLine =>
		{
			pokemonLine.forEach(pokemon =>
			{
				pokemon.render();
			});
		});

		this.leftBorder.render();
		this.rightBorder.render();
		this.imagePanelFrame.render();
		this.startButton.render();
		this.renderText();


	}

	renderText()
	{
		context.save();

		context.fillStyle = Colour.Crimson;
		context.font = `${ this.fontWeight } ${ this.fontSize }px ${ this.fontFamily }`;
		const text = "POKÉMON";
		const lineWidth = context.measureText(text).width;
		context.fillText(text, CANVAS_WIDTH / 2 - lineWidth / 2, 42);
		const text2 = "Tower Defense";
		const lineWidth2 = context.measureText(text2).width;
		context.fillText(text2, CANVAS_WIDTH / 2 - lineWidth2 / 2, 85);

		context.restore();
	}

	handleMouseDown(event)
	{
		// Loop through all clickables
		const x = event.offsetX / canvasScale;
		const y = event.offsetY / canvasScale;


		//button
		if (isPointInObject(x, y, this.startButton))
		{
			this.startButton.onPress();

			// If the user already has saved data, load the level select state, otherwise do the intro stuff
			if(getUsername())
				stateStack.push(new LevelSelectState());
			else
				stateStack.push(new InputUsernameState())

			this.removeEventListeners();
			return;
		}
	}
	handleMouseUp(event)
	{
		// Loop through all clickables
		const x = event.offsetX / canvasScale;
		const y = event.offsetY / canvasScale;
	}
	handleMouseMove(event)
	{
		// Loop through all clickables
		const x = event.offsetX / canvasScale;
		const y = event.offsetY / canvasScale;


		isPointInObject(x, y, this.startButton) ? this.startButton.onHover() : this.startButton.onNoHover();


	}

}
