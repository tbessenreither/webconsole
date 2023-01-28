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
import { nameItemTypeThe, nameItemTypeThe2 } from '../GenericItem/helpers';
import gameTick from '../GameTick';
import GenericRoom from '../GenericRoom';

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

		gameTick.add(this);
	}

	destruct(): void {
		gameTick.remove(this);
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
	}

	action(command: string) {
		command = command.toLowerCase();

		if (command === 'inventar') {
			Print.Line(this.listInventory(false), { html: true });
		} else if (command === 'beschreibe inventar') {
			Print.Line(this.listInventory(true), { html: true });
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

		console.log(action);

		if (!action) {
			Print.Line('Das verstehe ich nicht.');
			return;
		}

		this.actionHandler(action);
		let actionEvents = action.events;
		for (let event of actionEvents) {
			Print.Line(event, { html: true });
		}
	}

	actionHandler(action: Action): void {
		if (!action) {
			return;
		}

		switch (action.type) {
			case ActionType.Investigate:
				this.performInvestigate(action);
				break;
			case ActionType.PickUp:
				this.performPickUp(action);
				break;
			case ActionType.PutDown:
				this.performPutDown(action);
				break;
			case ActionType.Open:
				this.performOpen(action);
				break;
			case ActionType.Close:
				this.performClose(action);
				break;
			case ActionType.Lock:
				this.performLock(action);
				break;
			case ActionType.Unlock:
				this.performUnlock(action);
				break;
			case ActionType.Exit:
				this.performExit(action);
				break;
			case ActionType.Use:
				this.performUse(action);
				break;
			case ActionType.Read:
				this.performRead(action);
				break;
			default:
				action.addEvent('Diese Aktion kannst du nicht durchführen.');
				break;
		}

		gameTick.execute();
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
			let room = this._gameState.rooms[this.room] as GenericRoom;
			action.addEvent(room.describe(action));
			return;
		}

		for (let target of action.targets) {
			action.addEvent(`Du untersuchst ${target.name}.`);
			action.addEvent(target.describe(action));
			return;
		}
	}

	performPickUp(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		for (let target of action.targets) {
			if (target instanceof GenericItem) {
				let pickedUpItem = target.pickUp(action);
				if (pickedUpItem) {
					this.addToInventory(pickedUpItem);
					action.addEvent(`Du hast ${nameItemTypeThe2(target.type)} aufgehoben.`);
				} else {
					action.addEvent(`Du konntest ${target.name} nicht aufheben.`);
				}
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
			for (let target of action.targets) {
				this.removeFromInventory(target as GenericItem);
				action.using[0].addToInventory(target as GenericItem);
				Print.Line(`Du legst ${target.name} ab.`);
			}
		} else {
			for (let target of action.targets) {
				action.room.addToInventory(target as GenericItem, action.direction);
				Print.Line(`Du legst ${target.name} ab.`);
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
			gameTick.execute();
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

		if (newRoom === undefined) {
			Print.Type(`Als du durch ${nameExitThe(exit.type)} gehst, stürzt du in die Tiefe in den Void. Da hat der Programmierer wohl etwas falsch gemacht.`);
			Print.Type(`Du wirst durch die Magie des Spiels wieder in den letzten Raum zurück teleportiert.`);
			return;
		}
		exit.used = true;
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

		action.addEvent(`Du benutzt ${action.using[0].name} mit ${action.targets[0].name}.`)
		action.targets[0].use(action);
	}

	performRead(action: Action): void {
		if (!this.actionDefaultCheck(action)) {
			return;
		}

		let target = action.targets[0] as GenericItem;
		if (target.read) {
			target.read(action);
		}
	}

	addToInventory(item: GenericItem): void {
		this.inventory[item.id] = item;
		item.parent = this;
	}

	removeFromInventory(item: GenericItem): void {
		item.parent = null;
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
			inventoryString += `<br>- ${item.name} ${item.broken ? '- <span class="info">kaputt</span>' : ''}`;
			if (describe) {
				inventoryString += `<br>  ${item.describe()}`;
			}
		});
		inventoryString += `<br>Dein Gepäck wiegt ${inventoryWeight}kg.`;



		return inventoryString;
	}

	clearInventory(): void {
		// we trash the items so we need to properly destruct them
		for (let inventoryItem of Object.values(this.inventory)) {
			inventoryItem.parent = null;
			inventoryItem.destruct();
		}
		this.inventory = {};
	}

	describe(): string {
		return `Du bist ${this.name}.`;
	}
}