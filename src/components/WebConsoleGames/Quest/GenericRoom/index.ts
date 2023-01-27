
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


export default class GenericRoom implements GameObject {
	_gameState: GameState;

	id: RoomId;
	name: string;
	description: string;
	items: ItemObjectList = {};
	monsters: MonsterObjectList = {};
	exits: ExitObjectList = {};

	constructor(gameState: GameState, config: RoomConfig) {
		this._gameState = gameState;
		this.fromObject(config);
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
			id: this.id,
			name: this.name,
			description: this.description,
			items: itemsAsObjects,
			monsters: this.monsters,
			exits: this.exits,
		};
	}

	fromObject(object: RoomConfig): GameObject {
		this.id = object.id;
		this.name = object.name;
		this.description = object.description;

		for (let itemConfig of Object.values(object.items)) {
			this.items[itemConfig.id] = new GenericItem(itemConfig);
		}
		for (let monsterConfig of Object.values(object.monsters)) {
			this.monsters[monsterConfig.id] = new GenericMonster(monsterConfig);
		}

		for (let exitLink of object.exits) {
			let exit = this._gameState.getExitById(exitLink.id);
			if (exit) {
				exit.setRoomLocation(this.id, exitLink);
				this.addExit(exit);
			}
		}

		return this;
	}

	addExit(exit: GenericExit): void {
		this.exits[exit.id] = exit;
	}

	tick(): void {
		// Do nothing
	}

	describe(): string {
		let description = [];
		description.push(`${this.description}<br>`);

		if (Object.keys(this.monsters).length > 0) {
			description.push('Du bist nicht allein in diesem Raum.<br>');
			description.push('[Monsterbeschreibung'); //todo: add monster description
		}

		if (Object.keys(this.items).length === 0) {
			//description.push('Es befinden sich keine Gegenstände in diesem Raum.<br>');
		} else {
			let itemDescriptions = [];
			for (let item of Object.values(this.items)) {
				itemDescriptions.push(`${item.describe()}`);
			}
			description.push(itemDescriptions.join('<br>').trim() + '<br>');
		}

		if (Object.keys(this.exits).length === 0) {
			description.push('Es gibt keine sichtbaren Ausgänge aus diesem Raum.<br>');
		} else {
			let exitDescriptions: string[] = [];
			for (const exit of Object.values(this.exits)) {
				exitDescriptions.push(`${exit.describe(this.id)}`);
			}
			description.push(exitDescriptions.join('<br>')); /** */
		}

		return description.join('');
	}

	investigate(perception: number = 10): string {
		return this.describe();
	}

	lookupItemByName(name: string, direction: Direction = null): GenericItem | null {
		let itemsToLookup = Object.values(this.items);
		if (direction) {
			itemsToLookup = itemsToLookup.filter(item => item.location.direction === direction);
		}
		for (let item of itemsToLookup) {
			for (let keyword of item.keywords) {
				if (keyword.toLowerCase() === name.toLowerCase()) {
					return item;
				}
			}
		}
		return null;
	}

	lookupMonsterByName(name: string, direction: Direction = null): GenericMonster | null {
		let monstersToLookup = Object.values(this.monsters);
		if (direction) {
			monstersToLookup = monstersToLookup.filter(monster => monster.location.direction === direction);
		}
		for (let monster of monstersToLookup) {
			for (let keyword of monster.keywords) {
				if (keyword.toLowerCase() === name.toLowerCase()) {
					return monster;
				}
			}
		}
		return null;
	}

	lookupExitByName(name: string, direction: Direction = null): GenericExit | null {
		let exitsToLookup = Object.values(this.exits);

		if (direction) {
			exitsToLookup = exitsToLookup.filter(exit => exit.locations.get(this.id).direction === direction);
		}

		let exitType = lookupExitTypeByName(name);
		if (!exitType) {
			return null;
		}

		for (let exit of exitsToLookup) {
			if (exit.type === exitType) {
				return exit;
			}
		}

		return null;
	}

	lookupGameObjectByName(name: string, direction: Direction = null): GameObject | null {
		// lookup monsters first
		let lookedupMonster = this.lookupMonsterByName(name, direction);
		if (lookedupMonster) {
			return lookedupMonster;
		}

		// then lookup items
		let lookedupItem = this.lookupItemByName(name, direction);
		if (lookedupItem) {
			return lookedupItem;
		}

		// then lookup exits
		let lookedupExit = this.lookupExitByName(name, direction);
		if (lookedupExit) {
			return lookedupExit;
		}

		return null;
	}


	lookupExitByDirection(direction: string, onlyFilter?: ExitType[]): GenericExit | null {
		let directionMapped = lookupDirection(direction);

		for (let exit of Object.values(this.exits)) {
			if (onlyFilter && !onlyFilter.includes(exit.type)) {
				continue;
			}
			if (exit.locations.get(this.id).direction === directionMapped) {
				return exit;
			}
		}
		return null;
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

	putdownItem(action: Action): GenericItem[] | null {
		let items: GenericItem[] = [];
		for (let targetIndex in action.targets) {
			let target = action.targets[targetIndex] as GenericItem;
			target.location = new LocationDescriptor(action.direction, Height.Bottom);

			this.items[target.id] = target;
			items.push(target);
		}

		return items;
	}
}