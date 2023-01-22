import { WebConsole } from "../../../WebConsole";

import Player from "../Player";
import GenericRoom from "../GenericRoom";

export default class GameState {
	_console: WebConsole;
	gameInitiated: boolean;
	rooms: GenericRoom[];
	player: Player;
	messages: string[];
	gameOver: boolean;

	savegameName: string = '1';

	constructor(console: WebConsole) {
		this._console = console;
		this.gameInitiated = false;
		this.player = new Player();
		this.rooms = [];
		this.messages = [];
		this.gameOver = false;
	}

	toObject(): any {
		return {
			gameInitiated: this.gameInitiated,
			rooms: this.rooms.map(room => room.toObject()),
			player: this.player.toObject(),
			messages: this.messages,
			gameOver: this.gameOver
		};
	}

	fromObject(object: any): GameState {
		this.rooms = object.rooms.map((room: any) => {
			const genericRoom = new GenericRoom();
			genericRoom.fromObject(room);
			return genericRoom;
		});
		this.gameInitiated = object.gameInitiated;
		this.player = new Player();
		this.player.fromObject(object.player);
		this.messages = object.messages;
		this.gameOver = object.gameOver;

		return this;
	}

	initiate(playerName: string, characterName: string): void {
		this._console.print('Dein Spielstand wird vorbereitet...');

		this.player.name = characterName;
		this.player.playerName = playerName;

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

	tick(): void {
		this.rooms.forEach(room => room.tick());
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