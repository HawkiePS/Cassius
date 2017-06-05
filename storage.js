/**
 * Storage
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * This file handles the storage of room databases
 *
 * @license MIT license
 */

'use strict';

const fs = require('fs');
const BACKUP_INTERVAL = 60 * 60 * 1000;

class Storage {
	constructor() {
		this.databases = {};
		this.playerbase = {};
		this.backupInterval = setInterval(() => this.exportDatabases(), BACKUP_INTERVAL);
	}

	/**
	 * @param {string} roomid
	 */
	importDatabase(roomid) {
		let file = '{}';
		try {
			file = fs.readFileSync('./databases/' + roomid + '.json').toString();
		} catch (e) {}
		this.databases[roomid] = JSON.parse(file);
	}

	importPlayerbase() {
		let file = '{}';
		try {
			file = fs.readFileSync('./playerbase.json').toString();
		} catch (e) {}
		this.playerbase = JSON.parse(file);
	}

	/**
	 * @param {string} roomid
	 */
	exportDatabase(roomid) {
		if (!(roomid in this.databases)) return;
		fs.writeFileSync('./databases/' + roomid + '.json', JSON.stringify(this.databases[roomid]));
	}

	exportPlayerbase() {
		if (!this.playerbase) return;
		fs.writeFileSync('./playerbase.json', JSON.stringify(this.playerbase));
	}

	importDatabases() {
		let databases = fs.readdirSync('./databases');
		for (let i = 0, len = databases.length; i < len; i++) {
			let file = databases[i];
			if (!file.endsWith('.json')) continue;
			this.importDatabase(file.substr(0, file.indexOf('.json')));
		}
		this.importPlayerbase();
	}

	exportDatabases() {
		for (let roomid in this.databases) {
			this.exportDatabase(roomid);
		}
		this.exportPlayerbase();
	}

	createPlayer(user) {
		if (user.id in this.playerbase) return;
		this.playerbase[user.id] = {
			name: user.name,
			alts: [],
			characters: {},
			equipment: {},
			inventory: [],
			level: 1
		}
		if (this.playerbase[user.id].name !== user.name) this.playerbase[user.id].name = user.name;
	}

	/**
	 * @param {string} name
	 * @param {string} classChosen
	 */
	createCharacter(name, classChosen, user) {
		let characterID = Tools.toId(name);
		// if (!(class in Info.classes)) return false;
		let characterClass = Info.classes[characterClass];
		if (!(user.id in this.playerbase)) return;
		if (this.playerbase[user.id].characters[name]) return;
		this.playerbase[user.id].characters[characterID] = {
			name: name,
			classes: [];
			equipment: {
				weapon: {},
				armor: {},
				headgear: {},
				footgear: {},
				accessory: {}
			}
			exp: 0,
			level: 1,
			stats: {
				health: characterClass.stats.health,
				vitality: characterClass.stats.vitality,
				attack: 0,
				strength: characterClass.stats.strength,
				defence: 0,
				resilience: characterClass.stats.resilience,
				magic: 0,
				intelligence: characterClass.stats.intelligence,
				mdefence: 0,
				wisdom: characterClass.stats.wisdom,
				endurance: characterClass.stats.endurance,
				recovery: characterClass.stats.recovery,
				speed: characterClass.stats.speed,
				agility: characterClass.stats.agility,
				critical: characterClass.stats.critical,
				evasion: characterClass.stats.evasion
			}
			this.playerbase[user.id].characters[characterID].classes.push(characterClass.id);
		}


	}
	/**
	 * @param {number} points
	 * @param {string} roomid
	 */
	addPoints(points, user, roomid) {
		if (isNaN(points)) return;
		if (!(roomid in this.databases)) this.databases[roomid] = {};
		let database = this.databases[roomid];
		if (!('leaderboard' in database)) database.leaderboard = {};
		if (!(user.id in database.leaderboard)) database.leaderboard[user.id] = {points: 0};
		database.leaderboard[user.id].points += points;
		if (database.leaderboard[user.id].name !== user.name) database.leaderboard[user.id].name = user.name;
	}

	/**
	 * @param {number} points
	 * @param {string} roomid
	 */
	removePoints(points, user, roomid) {
		this.addPoints(-points, user, roomid);
	}

	/**
	 * @param {string} roomid
	 */
	getPoints(user, roomid) {
		if (!(roomid in this.databases)) this.databases[roomid] = {};
		let database = this.databases[roomid];
		if (!('leaderboard' in database)) database.leaderboard = {};
		if (!(user.id in database.leaderboard)) return 0;
		return database.leaderboard[user.id].points;
	}
}

module.exports = new Storage();
