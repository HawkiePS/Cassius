'use strict';

const name = "Engineer";

class Engineer {
	constructor() {
		this.statProgression = {
			health: 3,
			vitality: 0.175,
			attack: 0.25,
			strength: 0.175,
			defence: 1,
			resilience: 0.25,
			magic: 1.75,
			intelligence: 1.25,
			mdefence: 1,
			wisdom: 0.75,
			endurance: 1.25,
			recovery: 0.25,
			speed: 0,
			agility: 0.1,
			critical: 0.1,
			evasion: 0.05
		};
	}
	getStatGains(stat, level) {
		let levelUps = parseInt(level);
		levelUps--;
		return this.statProgression[stat] * levelUps;
	}
}


module.exports = new Engineer();
