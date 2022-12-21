export default class Graphic
{
	/**
	 * A wrapper for creating/loading a new Image() object.
	 *
	 * @param {String} path
	 * @param {Number} width
	 * @param {Number} height
	 */
	constructor(path, width, height, context)
	{
		this.image = new Image(width, height);
		this.image.src = path;
		this.width = width;
		this.height = height;
		this.context = context;
		this.opacity = 1;
	}

	render(x, y, width = this.width, height = this.height)
	{
		this.context.save();
		this.image.style.opacity = this.opacity.toString();
		this.context.globalAlpha = this.opacity;
		this.context.drawImage(this.image, x, y, width, height);
		this.context.restore();
	}
}
