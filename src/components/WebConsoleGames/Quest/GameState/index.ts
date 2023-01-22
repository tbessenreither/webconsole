import { GameStateConfig } from "./types";
import { WebConsole } from "../../../WebConsole";

import { RoomList, RoomObjectList } from "../GenericRoom/types";
import { ExitId, ExitList, ExitObjectList } from "../Exits/types";

import Player from "../Player";
import GenericRoom from "../GenericRoom";
import GenericExit from "../Exits";

import defaultRooms from "../Rooms";
console.log(defaultRooms);


export default class GameState {
	_console: WebConsole;
	gameInitiated: boolean;
	rooms: RoomObjectList;
	exits: ExitObjectList;
	player: Player;
	messages: string[];
	gameOver: boolean;

	savegameName: string = '1';

	constructor(webConsole: WebConsole) {
		this._console = webConsole;
		this.gameInitiated = false;
		this.player = new Player(this);
		this.rooms = {};
		this.exits = {};
		this.messages = [];
		this.gameOver = false;

		// load default Exits and Rooms
		// Exits need to be loaded first, because Rooms need to be able to reference them
		for (let exit of defaultRooms.exits) {
			this.exits[exit.id] = new GenericExit(exit);
		}
		for (let room of defaultRooms.rooms) {
			this.rooms[room.id] = new GenericRoom(this, room);
		}
	}

	getExitById(id: ExitId): GenericExit {
		return this.exits[id];
	}

	toObject(): GameStateConfig {
		let roomList: RoomList = [];
		for (let room of Object.values(this.rooms)) {
			roomList.push(room.toObject());
		}

		let exitList: ExitList = [];
		for (let exit of Object.values(this.exits)) {
			exitList.push(exit.toObject());
		}

		return {
			gameInitiated: this.gameInitiated,
			rooms: [],//roomList,
			exits: [],//exitList,
			player: this.player.toObject(),
			messages: this.messages,
			gameOver: this.gameOver
		};
	}

	fromObject(object: GameStateConfig): GameState {
		console.log('object', object);
		for (let exit of object.exits) {
			this.exits[exit.id] = new GenericExit(exit);
		}
		for (let room of object.rooms) {
			this.rooms[room.id] = new GenericRoom(this, room);
		}
		this.gameInitiated = object.gameInitiated;
		this.player = new Player(this);
		this.player.fromObject(object.player);
		this.messages = object.messages;
		this.gameOver = object.gameOver;

		return this;
	}

	initiate(playerName: string, characterName: string): void {
		this._console.print('Dein Spielstand wird vorbereitet...');

		this.player.name = characterName;
		this.player.playerName = playerName;
		this.player.room = 'Kerker';

		this.gameInitiated = true;

		this.save();
	}

	createSavegame(name: string, description: string = 'A Quest Savegame'): boolean {
		try {
			let existingSavegames = localStorage.getItem('quest-savegames');
			if (!existingSavegames) {
				existingSavegames = '{}';
			}

			const savegames = JSON.parse(existingSavegames);
			if (!savegames[name]) {
				savegames[name] = description;
				localStorage.setItem('quest-savegames', JSON.stringify(savegames));
			}

			localStorage.setItem('quest-last-savegame', name);

			this.savegameName = name;

			return true;
		} catch (e) {
			return false;
		}
	}

	loadLatestSavegame(): boolean {
		try {
			const savegame = localStorage.getItem('quest-last-savegame');
			if (!savegame) {
				return false;
			}
			this.savegameName = savegame;
			this.loadLatestSavegame();
			return true;
		} catch (e) {
			return false;
		}
	}

	command(command: string): void {
		if (command.startsWith('tu dinge')) {
		} else {
			let response = this.player.action(command);
			this._console.printLn(response, { html: true });
		}
	}

	printLn(message: string, options?: any) {
		this._console.printLn(message, options);
	}

	tick(): void {
		for (let room of Object.values(this.rooms)) {
			room.tick();
		}
		this.player.tick();
	}

	getLocalStorageName(): string {
		return `quest-savegame-${this.savegameName}`;
	}

	renameCharacter(name: string): void {
		this.player.name = name;
		this._console.printLn(`Deine Figur heißt jetzt ${name}.`);
		this.save();
	}

	renamePlayer(name: string): void {
		this.player.playerName = name;
		this._console.printLn(`Dein Name ist jetzt ${name}.`);
		this.save();
	}


	save(): boolean {
		try {
			this._console.printLn('Saving game...');
			this.createSavegame(this.savegameName);
			localStorage.setItem(this.getLocalStorageName(), JSON.stringify(this.toObject()));
			return true;
		} catch (e) {
			return false;
		}
	}

	load(): boolean {
		try {
			const savegame = localStorage.getItem(this.getLocalStorageName());
			if (savegame) {
				this.fromObject(JSON.parse(savegame));
				this._console.printLn('Savegame loaded.');
				return true;
			}
			return false;
		} catch (e) {
			return false;
		}
	}
}