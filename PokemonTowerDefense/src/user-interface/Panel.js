import UserInterfaceElement from "./UserInterfaceElement.js";
import { roundedRectangle } from "../../lib/DrawingHelpers.js";
import { context } from "../globals.js";
import Colour from "../enums/Colour.js";

export default class Panel extends UserInterfaceElement
{
	static PARTY_MENU = { x: 3, y: 15, width: 15, height: 2 };
	static LEVELS_MENU = { x: 1, y: 21 / 2 - 2, width: 19, height: 6 };
	static BOTTOM_DIALOGUE = { x: 21 / 2 - 6.5, y: 13, width: 13, height: 3 };
	static POKEMON_FOCUS_BOTTOM = { x: 0, y: 12, width: 18, height: 5 };
	static TOP_DIALOGUE = { x: 0, y: 0, width: 15, height: 3 };
	static MIDDLE_DIALOGUE = { x: 21 / 2 - 6.5, y: 8, width: 13, height: 3 };
	static POKEMON_STATS = { x: 7.5, y: 3.5, width: 7, height: 7 };
	static BATTLE_PLAYER = { x: 8, y: 5, width: 6.5, height: 2.5 };
	static BATTLE_OPPONENT = { x: 1, y: 1, width: 6.5, height: 2 };
	static BATTLE_EXPERIENCE = { x: 9, y: 7, width: 6, height: 4 };
	static CAUGHT_POKEMON = { x: 4, y: 6, width: 13, height: 5 };
	static DEFAULT_LEVEL_SELECTOR_LOCATION = { x: 2.75, y: 9.5, width: 3, height: 3, offset: 0.5 };
	static CURRENT_TEAM_IN_POKEMON_SELECT = { x: 1, y: 1, width: 19, height: 4 };
	static BOX_PANEL_POKEMON_SELECT = { x: 1, y: 7, width: 19, height: 8 };
	static DEFAULT_LEVEL_SELECT = {};
	static DEFAULT_PADDING = 10;
	static BORDER_WIDTH = 10;

	/**
	 * A UI element that is simply a rectangle that
	 * other UI elements are placed on top of.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {object} options
	 */
	constructor(x, y, width, height, options = {})
	{
		super(x, y, width, height);

		this.borderColour = options.borderColour ?? Colour.Grey;
		this.panelColour = options.panelColour ?? Colour.White;
		this.padding = options.padding ?? Panel.DEFAULT_PADDING;
		this.borderWidth = options.borderWidth ?? Panel.BORDER_WIDTH;
		this.fill = options.fill ?? true;
		this.stroke = options.stroke ?? false;
		this.strokeColour = options.strokeColour ?? Colour.Crimson;
		this.strokeWidth = options.strokeWidth ?? 5;
		this.isVisible = true;
	}

	render()
	{
		if (!this.isVisible)
		{
			return;
		}


		context.save();
		this.renderBackground();
		this.renderForeground();
		context.restore();
	}

	renderBackground()
	{
		context.fillStyle = this.borderColour;
		context.strokeStyle = this.strokeColour;
		context.strokeWidth = this.strokeWidth;
		roundedRectangle(
			context,
			this.position.x,
			this.position.y,
			this.dimensions.x,
			this.dimensions.y,
			this.borderWidth,
			this.fill,
			this.stroke
		);
	}

	renderForeground()
	{
		context.fillStyle = this.panelColour;
		context.strokeStyle = this.strokeColour;
		context.strokeWidth = this.strokeWidth;
		roundedRectangle(
			context,
			this.position.x + this.borderWidth / 2,
			this.position.y + this.borderWidth / 2,
			this.dimensions.x - this.borderWidth,
			this.dimensions.y - this.borderWidth,
			this.borderWidth,
			this.fill,
			this.stroke
		);
	}

	toggle()
	{
		this.isVisible = !this.isVisible;
	}
}
