import { PlayerConfig } from './types';
import { RoomId } from '../GenericRoom/types';
import { nameExitThe } from '../GenericExit/helpers';
import { ExitType } from '../GenericExit/types';

import GameState from '../Gamestate';
import GameObject from '../GameObject';
import GenericItem from '../GenericItem';
import { ItemList, ItemObjectList } from '../GenericItem/types';
import Action from '../Action';
import ActionParser from '../Action/ActionParser';
import { ActionConfig, ActionType } from '../Action/types';
import { LocationDescriptor } from '../Descriptors/Location';
import { Location, Direction, Height } from '../Location/types';
import Print from '../Print';
import { directionToStringTo, lookupDirection } from '../Location/helpers';
import GenericExit from '../GenericExit';

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


		let actionConfigBlueprint: ActionConfig = {
			type: null,
			origin: this,
			targets: null,
			using: null,
			room: this._gameState.rooms[this.room],
			direction: Direction.null,
		};
		let actionParser = new ActionParser(actionConfigBlueprint);

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

		if (command === 'inventar') {
			return this.listInventory(false);
		} else if (command === 'beschreibe inventar') {
			return this.listInventory(true);
		}

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

		if (!action) {
			return 'Das verstehe ich nicht.';
		}

		this.actionHandler(action);
		return '';
	}

	actionHandler(action: Action): void {
		console.log('handle action', action);
		switch (action.type) {
			case ActionType.Look:
				return this.look(action);
			case ActionType.PickUp:
				return this.pickUp(action);
			case ActionType.PutDown:
				return this.putDown(action);
			case ActionType.Open:
				return this.open(action);
			case ActionType.Close:
				return this.close(action);
			case ActionType.Lock:
				return this.lock(action);
			case ActionType.Unlock:
				return this.unlock(action);
			case ActionType.Exit:
				return this.exit(action);
			default:
				Print.Line('Das kannst du nicht tun.');
				return;
		}
	}

	actionDefaultCheck(action: Action): boolean {
		if (action.targets.length === 0 && action.parsedData.target === null) {
			Print.Line('Das geht so leider nicht.');
			return false;
		} else if (action.targets.length === 0 && action.parsedData.target !== null) {
			let directionPart = '';
			if (action.parsedData.targetDirection) {
				let directionParsed = lookupDirection(action.parsedData.targetDirection);
				directionPart = ` im ${directionToStringTo(directionParsed)}`;
			}
			Print.Line(`Du siehst${directionPart} nichts auf das die Beschreibung '${action.parsedData.target}' passt.`);
			return false;
		}
		return true;
	}

	look(action: Action): void {
		if (action.targets.length === 0 && action.parsedData.target !== null) {
			Print.Line(`Du siehst nichts auf das die Beschreibung '${action.parsedData.target}'`);
			return;
		} else if (action.targets.length === 0 && action.parsedData.target === null) {
			Print.Line('Du siehst dich um.');
			Print.Line(this._gameState.rooms[this.room].describe(), { html: true });
			return;
		}

		for (let target of action.targets) {
			Print.Line(`Du untersuchst ${target.name}.`);
			Print.Line(target.describe());
			return;
		}
	}

	pickUp(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let pickedUpItems = this._gameState.rooms[this.room].pickupItem(action);
		let pickedUpItemIds = pickedUpItems.map(item => item.id);

		for (let target of action.targets) {
			if (pickedUpItemIds.includes(target.id)) {
				Print.Line(`Du nimmst ${target.name} auf.`);
				this.addToInventory(target as GenericItem);
			} else {
				Print.Line(`Du kannst ${target.name} nicht aufheben.`);
			}
		}
	}

	putDown(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		if (action.using.length > 0) {
			//todo: implement putting down on a target
			Print.Line('Das kannst du "noch" nicht tun.');
		} else {
			let putDownItems = this._gameState.rooms[this.room].putdownItem(action);
			let putDownItemIds = putDownItems.map(item => item.id);

			for (let target of action.targets) {
				if (putDownItemIds.includes(target.id)) {
					Print.Line(`Du legst ${target.name} ab.`);
					this.removeFromInventory(target as GenericItem);
				} else {
					Print.Line(`Du kannst ${target.name} nicht ablegen.`);
				}
			}
		}
	}

	open(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let target = action.targets[0];

		if (target instanceof GenericExit) {
			if (target.closed) {
				if (target.open(action)) {
					Print.Line(`Du öffnest ${nameExitThe(target.type)}.`);
				} else {
					Print.Line(`${nameExitThe(target.type)} lässt sich nicht öffnen.`);
				}
			} else {
				Print.Line(`${nameExitThe(target.type)} ist bereits geöffnet.`);
			}
		} else {
			Print.Line('Das kannst du nicht öffnen.');
		}
	}

	close(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let target = action.targets[0];

		if (target instanceof GenericExit) {
			if (!target.closed) {
				if (target.close(action)) {
					Print.Line(`Du schließt ${nameExitThe(target.type)}.`);
				} else {
					Print.Line(`${nameExitThe(target.type)} lässt sich nicht schließen.`);
				}
			} else {
				Print.Line(`${nameExitThe(target.type)} ist bereits geschlossen.`);
			}
		} else {
			Print.Line('Das kannst du nicht schließen.');
		}
	}

	unlock(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let target = action.targets[0];

		if (target instanceof GenericExit) {
			if (target.locked) {
				// try every item in the inventory
				action.using = this.getUsableInventory();
				if (target.unlock(action)) {
					Print.Line(`Du schließt ${nameExitThe(target.type)} auf.`);
				} else {
					Print.Line(`${nameExitThe(target.type)} lässt sich nicht aufschließen.`);
				}
			} else {
				Print.Line(`${nameExitThe(target.type)} ist bereits aufgeschlossen.`);
			}
		} else {
			Print.Line('Das kannst du nicht aufschließen.');
		}
	}

	lock(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let target = action.targets[0];

		if (target instanceof GenericExit) {
			if (!target.locked) {
				// try every item in the inventory
				action.using = this.getUsableInventory();
				if (target.lock(action)) {
					Print.Line(`Du schließt ${nameExitThe(target.type)} ab.`);
				} else {
					Print.Line(`${nameExitThe(target.type)} lässt sich nicht abschließen.`);
				}
			} else {
				Print.Line(`${nameExitThe(target.type)} ist bereits abgeschlossen.`);
			}
		} else {
			Print.Line('Das kannst du nicht abschließen.');
		}
	}

	exit(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let exit = action.targets[0] as GenericExit;

		if (exit.closed) {
			if (!exit.open(action)) {
				Print.Line(`Du versuchst ${nameExitThe(exit.type)} zu öffnen.`);
				Print.Line(`${nameExitThe(exit.type)} lässt sich nicht öffnen.`);
				return;
			} else {
				Print.Line(`Du öffnest ${nameExitThe(exit.type)}.`);
			}
		}

		let newRoom = exit.targetRooms(this.room);
		Print.Line(`Du gehst durch ${nameExitThe(exit.type)}`);

		this.room = newRoom;
	}

	addToInventory(item: GenericItem): void {
		this.inventory[item.id] = item;
	}

	removeFromInventory(item: GenericItem): void {
		delete this.inventory[item.id];
	}

	getUsableInventory(): GenericItem[] {
		let usableInventory = Object.values(this.inventory);
		usableInventory = usableInventory.filter(itemObject => itemObject.isUsable);

		return usableInventory;
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

	describe(): string {
		return `Du bist ${this.name}.`;
	}

}