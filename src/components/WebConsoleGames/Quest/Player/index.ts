import { PlayerConfig } from './types';
import { RoomId } from '../GenericRoom/types';
import { nameExitThe, nameExitThe2 } from '../GenericExit/helpers';
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
		let actionEvents = action.events;
		for (let event of actionEvents) {
			Print.Line(event, { html: true });
		}
		return '';
	}

	actionHandler(action: Action): void {
		console.log('handle action', action);
		switch (action.type) {
			case ActionType.Investigate:
				return this.performInvestigate(action);
			case ActionType.PickUp:
				return this.performPickUp(action);
			case ActionType.PutDown:
				return this.performPutDown(action);
			case ActionType.Open:
				return this.performOpen(action);
			case ActionType.Close:
				return this.performClose(action);
			case ActionType.Lock:
				return this.performLock(action);
			case ActionType.Unlock:
				return this.performUnlock(action);
			case ActionType.Exit:
				return this.performExit(action);
			case ActionType.Use:
				return this.performUse(action);
			default:
				action.addEvent('Diese Aktion kannst du nicht durchführen.');
				return;
		}
	}

	actionDefaultCheck(action: Action): boolean {
		if (action.targets.length === 0 && action.parsedData.target === null) {
			action.addEvent('Das geht so leider nicht.');
			return false;
		} else if (action.targets.length === 0 && action.parsedData.target !== null) {
			let directionPart = '';
			if (action.parsedData.targetDirection) {
				let directionParsed = lookupDirection(action.parsedData.targetDirection);
				directionPart = ` im ${directionToStringTo(directionParsed)}`;
			}
			action.addEvent(`Du siehst${directionPart} nichts auf das die Beschreibung '${action.parsedData.target}' passt.`);
			return false;
		}
		return true;
	}

	performInvestigate(action: Action): void {
		if (action.targets.length === 0 && action.parsedData.target !== null) {
			action.addEvent(`Du siehst nichts auf das die Beschreibung '${action.parsedData.target}'`);
			return;
		} else if (action.targets.length === 0 && action.parsedData.target === null) {
			action.addEvent('Du siehst dich um.');
			action.addEvent(this._gameState.rooms[this.room].describe());
			return;
		}

		for (let target of action.targets) {
			action.addEvent(`Du untersuchst ${target.name}.`);
			action.addEvent(target.describe());
			return;
		}
	}

	performPickUp(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let pickedUpItems = this._gameState.rooms[this.room].pickupItem(action);
		let pickedUpItemIds = pickedUpItems.map(item => item.id);

		for (let target of action.targets) {
			if (pickedUpItemIds.includes(target.id)) {
				action.addEvent(`Du nimmst ${target.name} auf.`);
				this.addToInventory(target as GenericItem);
			} else {
				action.addEvent(`Du kannst ${target.name} nicht aufheben.`);
			}
		}
	}

	performPutDown(action: Action): void {
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

	performOpen(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let target = action.targets[0];

		if (target instanceof GenericExit) {
			action.addEvent(`Du ziehst an ${nameExitThe2(target.type)}.`);
			target.open(action);

		} else {
			action.addEvent('Das kannst du nicht öffnen.');
		}
	}

	performClose(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let target = action.targets[0];

		if (target instanceof GenericExit) {
			action.addEvent(`Du drückst ${nameExitThe(target.type)} ins Schloss.`);
			target.close(action);
		} else {
			action.addEvent('Das kannst du nicht schließen.');
		}
	}

	performUnlock(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let target = action.targets[0];

		if (target instanceof GenericExit) {
			// try every item in the inventory
			action.using = this.getUsableInventory();
			//action.addEvent(`Du schließt ${nameExitThe(target.type)} auf.`);
			target.unlock(action);

		} else {
			action.addEvent('Das kannst du nicht aufschließen.');
		}
	}

	performLock(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let target = action.targets[0];

		if (target instanceof GenericExit) {
			// try every item in the inventory
			action.using = this.getUsableInventory();
			//action.addEvent(`Du schließt ${nameExitThe(target.type)} ab.`);
			target.lock(action);

		} else {
			action.addEvent('Das kannst du nicht abschließen.');
		}
	}

	performExit(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let exit = action.targets[0] as GenericExit;

		if (exit.closed) {
			action.addEvent(`${nameExitThe(exit.type)} ist noch geschlossen. Du versuchst sie zu öffnen.`);
			if (!exit.open(action)) {
				return;
			}
		}

		let newRoom = exit.targetRooms(this.room);
		action.addEvent(`Du gehst durch ${nameExitThe(exit.type, exit.locations.get(this.room).direction)}`);

		//check if there is a transition message
		let exitLink = exit.locations.getLink(this.room);
		if (exitLink.transitionMessage) {
			action.addEvent(exitLink.transitionMessage);
		}

		this.room = newRoom;
	}

	performUse(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		if (action.using.length === 0) {
			action.addEvent(`Du siehst nichts was auf die Beschreibung "${action.parsedData.using}" passen würde.`);
			return;
		}

		if (!action.targets[0].use) {
			action.addEvent(`So kannst du nicht mit ${action.targets[0].name} interagieren.`);
			return;
		}

		console.log(action);
		action.addEvent(`Du benutzt ${action.using[0].name} mit ${action.targets[0].name}.`)
		action.targets[0].use(action);
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

	describe(): string {
		return `Du bist ${this.name}.`;
	}
}