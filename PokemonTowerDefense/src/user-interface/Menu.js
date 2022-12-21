import Panel from "./Panel.js";
import Selection from "./Selection.js";

export default class Menu extends Panel {
	static BATTLE_MENU = { x: 12, y: 8, width: 3, height: 3 };

	/**
	 * A UI element that is a Selection on a Panel.
	 * More complicated Menus may be collections
	 * of Panels and Selections that form a greater whole.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {array} items Elements are objects that each
	 * have a string `text` and function `onSelect` property.
	 */
	constructor(x, y, width, height, items) {
		super(x, y, width, height);

		this.selection = new Selection(x, y, width, height, items);
	}

	update() {
		this.selection.update();
	}

	render() {
		super.render();
		this.selection.render();
	}
}
