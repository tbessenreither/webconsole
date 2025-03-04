import { GameStateConfig } from "./types";
import { WebConsole } from "../../../WebConsole";
import { RoomList, RoomObjectList } from "../GenericRoom/types";
import { ExitId, ExitList, ExitObjectList } from "../GenericExit/types";
import GenericExit from "../GenericExit";
import Player from "../Player";
import GenericRoom from "../GenericRoom";
import defaultRooms from "../Rooms";
import gameTick from "../GameTick";
import gameEvent from "../GameEvent";
import RoomLookup from "../GenericRoom/RoomLookup";
import { GameTickEventList } from "../GameTick/types";

export default class GameState {
	_console: WebConsole;
	gameInitiated: boolean;
	rooms: RoomObjectList;
	exits: ExitObjectList;
	player: Player;
	gameTickEvents: GameTickEventList;
	messages: string[];
	gameOver: boolean;

	savegameName: string = '1';

	constructor(webConsole: WebConsole) {
		this._console = webConsole;
		this.gameInitiated = false;
		this.rooms = {};
		this.exits = {};
		this.messages = [];
		this.gameOver = false;

		RoomLookup.gameState = this;

		this.loadDefaultState();

		gameEvent.gameState = this;
		gameEvent.on('afterTick', this.eventHandlerAfterTick.bind(this));
	}

	loadDefaultState() {
		gameTick.reset();

		if (this.player) {
			this.player.destruct();
		}
		this.player = new Player(this);

		for (let exit of Object.values(this.exits)) {
			exit.destruct();
		}
		this.exits = {};

		for (let room of Object.values(this.rooms)) {
			room.destruct();
		}
		this.rooms = {};

		// load default Exits and Rooms
		// Exits need to be loaded first, because Rooms need to be able to reference them
		for (let exit of defaultRooms.exits) {
			this.exits[exit.id] = new GenericExit(exit);
		}
		for (let room of defaultRooms.rooms) {
			this.rooms[room.id] = new GenericRoom(this, room);
		}

		this.gameTickEvents = defaultRooms.gameEvents.tick;

		this.player.room = this.getStartingRoom().id;
	}

	eventHandlerAfterTick(ticksPassed: number) {
		if (this.gameTickEvents[ticksPassed]) {
			for (let event of this.gameTickEvents[ticksPassed]) {
				gameEvent.execute(event);
			}
		}
	}

	getStartingRoom(): GenericRoom {
		for (let room of Object.values(this.rooms)) {
			if (room.startingRoom) {
				return room;
			}
		}

		return Object.values(this.rooms)[0];
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
			gameOver: this.gameOver,
			ticksPassed: gameTick.ticksPassed,
		};
	}

	fromObject(object: GameStateConfig): GameState {
		for (let exit of object.exits) {
			if (this.exits[exit.id]) {
				this.exits[exit.id].destruct();
			}
			this.exits[exit.id] = new GenericExit(exit);
		}
		for (let room of object.rooms) {
			if (this.rooms[room.id]) {
				this.rooms[room.id].destruct();
			}
			this.rooms[room.id] = new GenericRoom(this, room);
		}
		this.gameInitiated = object.gameInitiated;
		if (this.player) {
			this.player.destruct();
		}
		this.player = new Player(this);
		this.player.fromObject(object.player);
		this.messages = object.messages;
		this.gameOver = object.gameOver;
		gameTick.ticksPassed = object.ticksPassed;

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

	deleteSavegame(name: string): boolean {
		try {
			let existingSavegames = localStorage.getItem('quest-savegames');
			if (!existingSavegames) {
				existingSavegames = '{}';
			}

			const savegames = JSON.parse(existingSavegames);
			if (savegames[name]) {
				delete savegames[name];
				localStorage.setItem('quest-savegames', JSON.stringify(savegames));
			}

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

	resetGame(): void {
		// store old player Data
		const playerName = this.player.playerName;
		const characterName = this.player.name;

		// reset game
		this.deleteSavegame(this.savegameName);

		this.loadDefaultState();
		this.initiate(playerName, characterName);
	}

	command(command: string): void {
		this.player.action(command);
		gameTick.execute();
	}

	printLn(message: string, options?: any) {
		this._console.printLn(message, options);
	}

	tick(): void {
		gameTick.execute();
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