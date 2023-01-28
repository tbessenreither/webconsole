
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
	addToInventory(item: GenericItem): void {
		this.items[item.id] = item;
		item.parent = this;
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