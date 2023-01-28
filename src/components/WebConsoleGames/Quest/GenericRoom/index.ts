
import { RoomId, RoomConfig } from './types';
import { ExitObjectList, ExitType } from '../GenericExit/types';
import { ItemId, ItemList } from "../GenericItem/types";

import GameObject from '../GameObject';
import GenericItem from '../GenericItem';
import { ItemObjectList } from '../GenericItem/types';
import GenericMonster from '../GenericMonster';
import { MonsterObjectList } from '../GenericMonster/types';
import GenericExit from '../GenericExit';
import GameState from '../GameState';
import { Direction, Height } from '../Location/types';
import { lookupDirection } from '../Location/helpers';
import Action from '../Action';
import { lookupExitTypeByName } from '../GenericExit/helpers';
import { LocationDescriptor } from '../Descriptors/Location';
import { filterGameObjectList } from '../GameObject/helpers';
import gameTick from '../GameTick';


export default class GenericRoom implements GameObject {
	_gameState: GameState;

	startingRoom: boolean = false;
	id: RoomId;
	name: string;
	description: string;
	items: ItemObjectList = {};
	monsters: MonsterObjectList = {};
	exits: ExitObjectList = {};

	constructor(gameState: GameState, config: RoomConfig) {
		this._gameState = gameState;
		this.fromObject(config);

		gameTick.add(this);
	}

	destruct(): void {
		gameTick.remove(this);
	}

	get isUsable(): boolean {
		return false;
	}

	toObject(): any {
		let itemsAsObjects: ItemList = [];
		for (let itemObject of Object.values(this.items)) {
			itemsAsObjects.push(itemObject.toObject());
		}
		return {
			startingRoom: this.startingRoom,
			id: this.id,
			name: this.name,
			description: this.description,
			items: itemsAsObjects,
			monsters: this.monsters,
			exits: this.exits,
		};
	}

	fromObject(object: RoomConfig): GameObject {
		this.startingRoom = object.startingRoom || false;
		this.id = object.id;
		this.name = object.name;
		this.description = object.description;

		for (let itemConfig of Object.values(object.items)) {
			this.items[itemConfig.id] = new GenericItem(itemConfig, this);
		}
		for (let monsterConfig of Object.values(object.monsters)) {
			this.monsters[monsterConfig.id] = new GenericMonster(monsterConfig);
		}

		for (let exitLink of object.exits) {
			let exit = this._gameState.getExitById(exitLink.id);
			if (exit) {
				exit.addRoomLocation(this.id, exitLink);
				this.addExit(exit);
			}
		}

		return this;
	}

	getExits(): ExitObjectList {
		for (let exit of Object.values(this.exits)) {
			exit.setRoomLocation(this.id);
		}
		return this.exits;
	}

	addExit(exit: GenericExit): void {
		this.exits[exit.id] = exit;
	}

	tick(): void {
		// Do nothing
	}

	describe(action: Action): string {
		let description = [];
		description.push(`${this.description}<br>`);

		let monsters = filterGameObjectList(this.monsters) as GenericMonster[];
		if (monsters.length > 0) {
			description.push('Du bist nicht allein in diesem Raum.<br>');
			description.push('[Monsterbeschreibung'); //todo: add monster description
		}

		let items = filterGameObjectList(this.items) as GenericItem[];
		if (items.length === 0) {
			//description.push('Es befinden sich keine Gegenstände in diesem Raum.<br>');
		} else {
			let itemDescriptions = [];
			for (let item of items) {
				itemDescriptions.push(`${item.describe()}`);
			}
			description.push(itemDescriptions.join('<br>').trim() + '<br>');
		}

		let exits = filterGameObjectList(this.exits) as GenericExit[];
		if (exits.length === 0) {
			description.push('Es gibt keine sichtbaren Ausgänge aus diesem Raum.<br>');
		} else {
			let exitDescriptions: string[] = [];
			for (const exit of exits) {
				exitDescriptions.push(`${exit.describe(action)}`);
			}
			description.push(exitDescriptions.join('<br>')); /** */
		}

		return description.join('');
	}

	performRoomAction(roomAction: string) {
		let actionParts = roomAction.split(' ');

		if (actionParts[0] === 'unhide') {
			let exit = this.exits[actionParts[1]];
			if (exit) {
				exit.isHidden = false;
			}
		}
	}

	pickupItem(action: Action): GenericItem[] | null {
		let items: GenericItem[] = [];
		for (let targetIndex in action.targets) {
			let target = action.targets[targetIndex];
			let item = this.items[target.id];

			if (!item.canBePickedUp) {
				continue;
			}

			if (item) {
				delete this.items[target.id];
				items.push(item);
			}
		}

		return items;
	}

	removeFromInventory(item: GenericItem): void {
		item.parent = null;
		delete this.items[item.id];
	}

	addToInventory(item: GenericItem, direction: Direction = null): void {
		if (direction !== null) {
			item.location = new LocationDescriptor(direction, Height.Bottom);
		}

		this.items[item.id] = item;
		item.parent = this;
	}
}