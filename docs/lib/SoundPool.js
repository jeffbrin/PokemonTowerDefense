export default class SoundPool {
	/**
	 * Manages an array of sounds so that we can play the same sound
	 * multiple times in our game without having to wait for one sound
	 * to be finished playing before playing the same sound again.
	 *
	 * Taken from https://blog.sklambert.com/html5-canvas-game-html5-audio-and-finishing-touches/
	 *
	 * @param {String} source
	 * @param {Number} size
	 */
	constructor(source, size = 1, volume, loop = false, maxDuration = null) {
		this.source = source;
		this.size = size;
		this.volume = volume;
		this.loop = loop;
		this.pool = [];
		this.currentSound = 0;
		this.maxDuration = maxDuration;

		// this.initializePool();
	}

	initializePool() {
		for (let i = 0; i < this.size; i++) {
			const audio = new Audio(this.source);
			audio.volume = this.volume;
			audio.loop = this.loop;
			audio.preload = false;
			this.pool.push(audio);
		}
	}

	/**
	 * Checks if the currentSound is ready to play, plays the sound,
	 * then increments the currentSound counter.
	 */
	play() {

		// Make the new audio
		const audio = new Audio(this.source);
		audio.volume = this.volume;
		audio.loop = this.loop;
		audio.preload = false;
		audio.play();

		this.pool.push(audio);

		// Set max duration
		if(this.maxDuration){
			setTimeout(() => {
				if(this.pool.includes(audio)){
					audio.pause();
					this.pool.splice(this.pool.indexOf(audio), 0);
				}
			}, this.maxDuration);
		}

		// Remove oldest sound to make more room
		if(this.pool.length > this.size)
			this.pool.splice(0, 1);

		this.currentSound = this.pool.length-1; 
	}

	pause() {
		this.pool[this.currentSound].pause();
	}

	isPaused() {
		return this.pool[this.currentSound].paused;
	}

	stop() {
		this.pause();
		this.pool[this.currentSound].currentTime = 0;
	}
}
