'use strict';

const fs = require('fs');

class Info {
	constructor() {
		this.classes = {};
	}

	loadClasses() {
		let classes;
		try {
			classes = fs.readdirSync('./classes');
		} catch (e) {}
		if (classes) {
			for (let i = 0, len = classes.length; i < len; i++) {
				let fileName = classes[i];
				if (!fileName.endsWith('.js')) continue;
				let characterClass = require('./classes/' + fileName);
				this.classes[characterClass.id] = characterClass;
			}
			for (let i in this.classes) {
				let characterClass = this.modes[i];
				if (characterClass.aliases) {
					for (let i = 0, len = characterClass.aliases.length; i < len; i++) {
						let alias = Tools.toId(characterClass.aliases[i]);
						if (alias in this.classes) throw new Error(characterClass.name + " alias '" + alias + "' is already a class.");
						this.classes[alias] = characterClass;
						characterClass.aliases[i] = alias;
					}
				}
			}
		}
	}
}

module.exports = new Info();
