/**
 * Command Parser
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * This file parses command messages.
 *
 * @license MIT license
 */

'use strict';

class Context {
	/**
	 * @param {string} target
	 * @param {string} command
	 * @param {number} [time]
	 */
	constructor(target, room, user, command, time) {
		this.target = target ? target.trim() : '';
		this.room = Rooms.get(room) || Users.get(room); // typescript hack until it supports more JSDoc tags
		this.user = Users.get(user); // typescript hack until it supports more JSDoc tags
		this.command = command;
		this.time = time || Date.now();
	}

	/**
	 * @param {string} text
	 */
	say(text) {
		this.room.say(text);
	}

	/**
	 * @param {string} [command]
	 * @param {string} [target]
	 */
	run(command, target) {
		if (command) {
			command = Tools.toId(command);
			if (!Commands[command]) return;
			let type = typeof Commands[command];
			if (type === 'string') {
				command = Commands[command];
				type = typeof Commands[command];
			}
			if (type !== 'function') return;
			target = target.trim();
		} else {
			command = this.command;
			target = this.target;
		}

		try {
			Commands[command].call(this, target, this.room, this.user, this.command, this.time);
		} catch (e) {
			let stack = e.stack;
			stack += 'Additional information:\n';
			stack += 'Command = ' + command + '\n';
			stack += 'Target = ' + target + '\n';
			stack += 'Time = ' + new Date(this.time).toLocaleString() + '\n';
			stack += 'User = ' + this.user.name + '\n';
			stack += 'Room = ' + (this.room instanceof Users.User ? 'in PM' : this.room.id);
			console.log(stack);
		}
	}
}

class CommandParser {
	/**
	 * @param {string} message
	 * @param {number} [time]
	 */
	parse(message, room, user, time) {
		message = message.trim();
		if (message.charAt(0) !== Config.commandCharacter) return;

		message = message.substr(1);
		let spaceIndex = message.indexOf(' ');
		let target = '';
		let command = '';
		if (spaceIndex !== -1) {
			command = message.substr(0, spaceIndex);
			target = message.substr(spaceIndex + 1);
		} else {
			command = message;
		}
		command = Tools.toId(command);
		if (!Commands[command]) return;
		let type = typeof Commands[command];
		if (type === 'string') {
			command = Commands[command];
			type = typeof Commands[command];
		}
		if (type !== 'function') return;

		new Context(target, room, user, command, time).run();
	}
}

module.exports = new CommandParser();
