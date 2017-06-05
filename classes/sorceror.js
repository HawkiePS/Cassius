'use strict';

const name = "Sorceror";

class Sorceror {
	constructor() {
		this.statProgression = {
			health: 3,
			vitality: 0.175,
			attack: 0.1,
			strength: 0.1,
			defence: 0.5,
			resilience: 0.25,
			magic: 3,
			intelligence: 1.25,
			mdefence: 2,
			wisdom: 0.75,
			endurance: 0.75,
			recovery: 0.25,
			speed: 0,
			agility: 0.1,
			critical: 0.1,
			evasion: 0.1
		};
	}
	getStatGains(stat, levels) {
		let levelUps = parseInt(levels);
		levelUps--;
		return this.statProgression[stat] * levelUps;
	}
}


module.exports = new Sorceror();
