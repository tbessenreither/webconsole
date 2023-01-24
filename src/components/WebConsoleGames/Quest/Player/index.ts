import { PlayerConfig } from './types';
import { RoomId } from '../GenericRoom/types';
import { nameExitThe } from '../Exits/helpers';
import { ExitType } from '../Exits/types';

import GameState from '../Gamestate';
import GameObject from '../GameObject';
import GenericItem from '../GenericItem';
import { ItemList, ItemObjectList } from '../GenericItem/types';
import Action from '../Action';
import ActionParser from '../Action/ActionParser';
import { ActionConfig, ActionType } from '../Action/types';
import { LocationDescriptor } from '../Descriptors/Location';
import { Location, Direction, Height } from '../Location/types';

export default class Player implements GameObject {
	id: string = 'player';
	_gameState: GameState;

	playerName: string;
	name: string;
	room: RoomId;
	health: number;
	maxHealth: number;
	strength: number;
	defense: number;
	perception: number;
	inventory: ItemObjectList;
	equipped: {
		weapon: GameObject | null;
		armor: GameObject | null;
		accessory: GameObject | null;
	};

	constructor(gameState: GameState) {
		this._gameState = gameState;

		this.playerName = 'Player';
		this.name = 'Player';
		this.room = 'Kerker';
		this.health = 100;
		this.maxHealth = 100;
		this.strength = 10;
		this.defense = 10;
		this.perception = 10;
		this.inventory = {};
		this.equipped = {
			weapon: null,
			armor: null,
			accessory: null
		};
	}

	get isUsable(): boolean {
		return true;
	}

	toObject(): PlayerConfig {
		let playerInventory: ItemList = [];
		for (let itemObject of Object.values(this.inventory)) {
			playerInventory.push(itemObject.toObject());
		}

		return {
			playerName: this.playerName,
			name: this.name,
			room: this.room,
			health: this.health,
			maxHealth: this.maxHealth,
			strength: this.strength,
			defense: this.defense,
			perception: this.perception,
			inventory: playerInventory,
			equipped: {
				weapon: this.equipped.weapon ? this.equipped.weapon.toObject() : null,
				armor: this.equipped.armor ? this.equipped.armor.toObject() : null,
				accessory: this.equipped.accessory ? this.equipped.accessory.toObject() : null
			}
		};
	}

	fromObject(object: PlayerConfig): GameObject {
		this.playerName = object.playerName;
		this.name = object.name;
		this.room = object.room || 'Kerker';
		this.health = object.health;
		this.maxHealth = object.maxHealth;
		this.strength = object.strength;
		this.defense = object.defense;

		for (let itemConfig of object.inventory) {
			this.inventory[itemConfig.name] = new GenericItem(itemConfig);
		}
		this.equipped = {
			weapon: object.equipped.weapon ? new GenericItem(object.equipped.weapon) : null,
			armor: object.equipped.armor ? new GenericItem(object.equipped.armor) : null,
			accessory: object.equipped.accessory ? new GenericItem(object.equipped.accessory) : null
		};

		return this;
	}

	tick(): void {
		for (let itemObject of Object.values(this.inventory)) {
			itemObject.tick();
		}
		this.equipped.weapon && this.equipped.weapon.tick();
		this.equipped.armor && this.equipped.armor.tick();
		this.equipped.accessory && this.equipped.accessory.tick();
	}

	action(command: string): string {
		command = command.toLowerCase();

		let actionConfigBlueprint: ActionConfig = {
			type: null,
			origin: this,
			targets: null,
			using: null,
			room: this._gameState.rooms[this.room],
			direction: Direction.null,
		};
		let actionParser = new ActionParser(actionConfigBlueprint);
		let action = actionParser.parse(command);

		console.log(action);

		if (command.startsWith('untersuche')) {
			return this.investigate(command.substr(11).trim());
		} else if (command.startsWith('öffne') && command.endsWith('tür')) {
			return this.openExit(command);
		} else if (command.startsWith('schließe') && command.endsWith('tür')) {
			return this.closeExit(command);
		} else if ((command.startsWith('sperre ') || command.startsWith('schließe ')) && (command.endsWith('tür zu') || command.endsWith('tür ab'))) {
			return this.lockExit(command);
		} else if (command.startsWith('sperre ') || command.startsWith('schließe ') && command.endsWith('tür auf')) {
			return this.unlockExit(command);
		} else if (command.startsWith('gehe durch ') && (command.endsWith('tür') || command.endsWith('fenster'))) {
			return this.goThroughLockable(command, [ExitType.Door, ExitType.Window]);
		} else if (command.startsWith('gehe durch ') && command.endsWith('gang')) {
			return this.goThroughWay(command, [ExitType.Hallway, ExitType.Alley, ExitType.Pathway]);
		} else if (command.startsWith('nimm ')) {
			return this.take(command);
		} else if (command === 'inventar') {
			return this.listInventory(false);
		} else if (command === 'beschreibe inventar') {
			return this.listInventory(true);
		}
	}

	openExit(command: string): string {
		let parts = command.split(' ');

		let direction = parts[1];
		let lookedupExit = this._gameState.rooms[this.room].lookupExitByDirection(direction);
		if (!lookedupExit) {
			return 'Du siehst keine Tür in dieser Richtung.';
		}

		if (!lookedupExit.closed) {
			return 'Die Tür ist bereits geöffnet.';
		}

		let action = new Action({
			type: ActionType.Open,
			origin: this,
			targets: [lookedupExit],
			using: Object.values(this.inventory),
			room: this._gameState.rooms[this.room],
			direction: Direction.null,
		});
		return lookedupExit.open(action) ? 'Die Tür ist nun geöffnet.' : 'Die Tür lässt sich nicht öffnen.';
	}

	closeExit(command: string): string {
		let parts = command.split(' ');

		let direction = parts[1];
		let lookedupExit = this._gameState.rooms[this.room].lookupExitByDirection(direction);
		if (!lookedupExit) {
			return 'Du siehst keine Tür in dieser Richtung.';
		}

		if (lookedupExit.closed) {
			return 'Die Tür ist bereits geschlossen.';
		}

		let action = new Action({
			type: ActionType.Open,
			origin: this,
			targets: [lookedupExit],
			using: Object.values(this.inventory),
			room: this._gameState.rooms[this.room],
			direction: Direction.null,
		});
		return lookedupExit.close(action) ? 'Die Tür ist nun geschlossen.' : 'Die Tür lässt sich nicht schließen.';
	}

	unlockExit(command: string): string {
		let parts = command.split(' ');

		let direction = parts[1];
		let lookedupExit = this._gameState.rooms[this.room].lookupExitByDirection(direction);
		if (!lookedupExit) {
			return 'Du siehst keine Tür in dieser Richtung.';
		}

		if (!lookedupExit.locked) {
			return 'Die Tür ist bereits aufgeschlossen.';
		}

		let action = new Action({
			type: ActionType.Open,
			origin: this,
			targets: [lookedupExit],
			using: Object.values(this.inventory),
			room: this._gameState.rooms[this.room],
			direction: Direction.null,
		});
		return lookedupExit.unlock(action) ? 'Die Tür ist nun aufgeschlossen.' : 'Die Tür lässt sich nicht aufschließen.';
	}

	lockExit(command: string): string {
		command = command.toLowerCase();
		let parts = command.split(' ');

		let direction = parts[1];
		let lookedupExit = this._gameState.rooms[this.room].lookupExitByDirection(direction);
		if (!lookedupExit) {
			return 'Du siehst keine Tür in dieser Richtung.';
		}

		if (lookedupExit.locked) {
			return 'Die Tür ist bereits abgeschlossen.';
		}

		let action = new Action({
			type: ActionType.Open,
			origin: this,
			targets: [lookedupExit],
			using: Object.values(this.inventory),
			room: this._gameState.rooms[this.room],
			direction: Direction.null,
		});
		return lookedupExit.lock(action) ? 'Die Tür ist nun abgeschlossen.' : 'Die Tür lässt sich nicht abschließen.';
	}

	goThroughWay(command: string, exitType?: ExitType[]): string {
		let parts = command.split(' ');

		let direction = parts[2];
		let lookedupExit = this._gameState.rooms[this.room].lookupExitByDirection(direction, exitType);
		if (!lookedupExit) {
			return 'In dieser Richtung geht es nicht weiter.';
		}
		let lookedupLink = lookedupExit.locations.getLink(this.room);

		if (lookedupExit.closed) {
			return `${nameExitThe(lookedupExit.type)} ist versperrt.`;
		}

		this.room = lookedupExit.targetRooms(this.room);

		let message = `Du gehst durch ${nameExitThe(lookedupExit.type)}`;

		if (lookedupLink && lookedupLink.transitionMessage) {
			message += `<br>${lookedupLink.transitionMessage}`;
		}
		return message;
	}

	goThroughLockable(command: string, exitType?: ExitType[]): string {
		let parts = command.split(' ');

		let direction = parts[2];
		let lookedupExit = this._gameState.rooms[this.room].lookupExitByDirection(direction, exitType);
		if (!lookedupExit) {
			return 'In dieser Richtung geht es nicht weiter.';
		}

		if (lookedupExit.closed) {
			return `${nameExitThe(lookedupExit.type)} ist geschlossen.`;
		}

		this.room = lookedupExit.targetRooms(this.room);

		return `Du gehst durch ${nameExitThe(lookedupExit.type)}`;
	}

	investigate(command: string): string {
		if (command === '') {
			return this._gameState.rooms[this.room].investigate(this.perception);
		} else if (command.includes('tür')) {
			let parts = command.split(' ');
			let direction = parts[0];

			let lookedupExit = this._gameState.rooms[this.room].lookupExitByDirection(direction);

			if (lookedupExit) {
				return lookedupExit.describe(this.room);
			} else {
				return 'Du siehst keine Tür in dieser Richtung.';
			}
		} else {
			let parts = command.split(' ');
			let item = parts[0];

			let lookedupItem = this._gameState.rooms[this.room].lookupItemByName(item);

			if (lookedupItem) {
				return lookedupItem.describe();
			} else {
				return 'Du siehst nichts in dieser Richtung.';
			}
		}
	}

	addToInventory(item: GenericItem): void {
		this.inventory[item.id] = item;
	}

	searchInventoryByName(name: string): GenericItem | null {
		for (let item of Object.values(this.inventory)) {
			if (
				item.name.toLowerCase() === name.toLowerCase()
				|| item.keywords.some(keyword => keyword.toLowerCase() === name.toLowerCase())
			) {
				return item;
			}
		}
		return null;
	}

	take(command: string): string {
		let parts = command.trim().split(' ');
		parts.shift();

		let item = parts.join(' ');

		if (item === '') {
			return 'Was willst du nehmen?';
		}

		let lookedupItem = this._gameState.rooms[this.room].lookupItemByName(item);
		if (!lookedupItem) {
			return 'Auf diese Beschreibung passt nichts in diesem Raum.';
		}

		if (!lookedupItem.canBePickedUp) {
			return 'Das kannst du nicht nehmen.';
		}

		let action = new Action({
			type: ActionType.PickUp,
			origin: this,
			targets: [lookedupItem],
			using: [],
			room: this._gameState.rooms[this.room],
			direction: Direction.null,
		})

		let itemObject = this._gameState.rooms[this.room].pickupItem(action);
		itemObject.location = new LocationDescriptor(Direction.null, Height.null);
		this.addToInventory(itemObject);

		return `Du nimmst ${itemObject.name} auf.`;
	}

	listInventory(describe: boolean = false) {
		let inventory = Object.values(this.inventory);
		if (inventory.length === 0) {
			return 'Du hast nichts dabei.';
		}

		let inventoryWeight = 0;

		let inventoryString = 'Du hast dabei:';
		inventory.forEach((item) => {
			if (item.weight) {
				inventoryWeight += item.weight;
			}
			inventoryString += `<br>${item.name} ${item.broken ? '- kaputt' : ''}`;
			if (describe) {
				inventoryString += `<br>  ${item.describe()}`;
			}
		});
		inventoryString += `<br>Dein Gepäck wiegt ${inventoryWeight}kg.`;



		return inventoryString;
	}

	use(action: Action): void {
		// Do nothing
	}

}