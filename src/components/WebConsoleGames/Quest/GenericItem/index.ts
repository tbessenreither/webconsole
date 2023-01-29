import GameObject from '../GameObject';
import { LocationDescriptor } from '../Descriptors/Location';
import { ItemId, ItemType, ItemConfig, ItemObjectList, ItemMeta, ItemConfigList } from './types';
import Action from '../Action';
import { capitalizeFirstLetter, handleMessageEvent, joinSentences, joinWithCommaAndAnd } from '../Descriptors/Text';
import { nameItemType, nameItemTypeA } from './helpers';
import { MessageEventConfig, MessageEventList } from '../GameObject/types';
import gameTick from '../GameTick';
import { Direction, Height } from '../Location/types';

export default class GenericItem implements GameObject {
	id: ItemId;
	name: string;
	keywords: string[];
	type: ItemType;
	location: LocationDescriptor;
	description: string;
	value: number;
	weight: number;
	uses: number;
	timesUsed: number;
	equippable: boolean;
	equipped: boolean;
	broken: boolean;
	hasInventory: boolean;
	inventory: ItemObjectList;
	meta: ItemMeta;
	canBeOpened: boolean;
	isOpen: boolean;
	parent: GameObject;
	messageEvents: MessageEventList;

	constructor(config: ItemConfig, parent: GameObject = null) {
		this.fromObject(config, parent);

		this.pickUp = this.pickUp.bind(this);

		gameTick.add(this);
	}

	destruct(): void {
		gameTick.remove(this);
	}

	get isUsable(): boolean {
		return (
			this.broken === false
		);
	}

	get canBePickedUp(): boolean {
		return (
			this.weight !== null
			&& this.weight < 20
		);
	}

	toObject(): ItemConfig {
		return {
			id: this.id,
			name: this.name,
			keywords: this.keywords,
			type: this.type,
			location: this.location.location,
			description: this.description,
			value: this.value,
			weight: this.weight,
			uses: this.uses,
			timesUsed: this.timesUsed,
			equippable: this.equippable,
			equipped: this.equipped,
			broken: this.broken,
			hasInventory: this.hasInventory,
			inventory: Object.values(this.inventory).map(item => item.toObject()),
			meta: this.meta,
			canBeOpened: this.canBeOpened,
			isOpen: this.isOpen,
			messageEvents: this.messageEvents,
		};
	}

	fromObject(object: ItemConfig, parent: GameObject = null): GameObject {
		this.parent = parent;

		this.id = object.id;
		this.name = object.name;
		this.keywords = object.keywords;
		this.type = object.type;
		this.location = object.location ? new LocationDescriptor(object.location.direction, object.location.height) : new LocationDescriptor(Direction.null, Height.null);
		this.description = object.description;
		this.value = object.value;
		this.weight = object.weight;
		this.uses = object.uses || null;
		this.timesUsed = object.timesUsed || 0;
		this.equippable = object.equippable;
		this.equipped = object.equipped;
		this.broken = object.broken || false;
		this.hasInventory = object.hasInventory || false;
		this.meta = object.meta || {};
		this.canBeOpened = object.canBeOpened || false;
		this.isOpen = object.isOpen || true;
		this.messageEvents = object.messageEvents || {};

		this.inventory = {};
		if (object.inventory) {
			for (let item of object.inventory) {
				this.inventory[item.id] = new GenericItem(item, this);
			}
		}

		let itemTypeName = nameItemType(this.type);
		if (!this.keywords.includes(itemTypeName)) {
			this.keywords.push(itemTypeName);
		}

		return this;
	}

	read(action: Action): void {
		if (!this.meta.text) {
			action.addEvent(`Es gibt nichts zu lesen`);
			return;
		}

		if (this.messageEvents.beforeReading) {
			this.messageEvents.beforeReading = handleMessageEvent(action, this.messageEvents.beforeReading);
		}

		action.addEvent(`Du liest ${nameItemTypeA(this.type)}`);
		action.addEvent(this.meta.text.toString());

		if (this.meta.attached) {
			action.addEvent(`An den Brief ist etwas angeheftet:`);
			for (let attachement of this.meta.attached as ItemConfigList) {
				let itemObject = new GenericItem(attachement, action.origin);
				action.addEvent(`Du erhältst ${nameItemTypeA(itemObject.type)}`);
				action.origin.addToInventory(itemObject);
			}
			delete this.meta.attached;
		}

		if (this.meta.roomActionsAfterReading && Array.isArray(this.meta.roomActionsAfterReading)) {
			for (let roomAction of this.meta.roomActionsAfterReading) {
				action.room.performRoomAction(roomAction.toString());
			}
			delete this.meta.roomActionsAfterReading;
		}

		if (this.meta.nameAfterReading) {
			this.name = this.meta.nameAfterReading.toString();
		} else {
			this.name = `${this.name} (gelesen)`;
		}

		if (this.messageEvents.afterReading) {
			this.messageEvents.afterReading = handleMessageEvent(action, this.messageEvents.afterReading);
		}
	}

	pickUp(action: Action = null): GenericItem | null {
		if (!this.canBePickedUp) {
			return null;
		}

		if (!this.parent || !this.parent.removeFromInventory) {
			return null;
		}

		if (this.messageEvents.onPickUp) {
			this.messageEvents.onPickUp = handleMessageEvent(action, this.messageEvents.onPickUp as MessageEventConfig);
		}

		this.parent.removeFromInventory(this);

		if (this.meta.roomActionsAfterPickUp && Array.isArray(this.meta.roomActionsAfterPickUp)) {
			for (let roomAction of this.meta.roomActionsAfterPickUp) {
				action.room.performRoomAction(roomAction.toString());
			}
			delete this.meta.roomActionsAfterReading;
		}

		if (this.messageEvents.afterPickUp) {
			this.messageEvents.afterPickUp = handleMessageEvent(action, this.messageEvents.afterPickUp);
		}

		return this;
	}

	tick(): void {
		// Do nothing
	}

	addToInventory?(item: GenericItem): void {
		this.inventory[item.id] = item;
		item.parent = this;
	}

	removeFromInventory(item: GenericItem): void {
		item.parent = null;
		delete this.inventory[item.id];
	}

	searchInventoryByName(name: string): GenericItem | null {
		for (let item of Object.values(this.inventory)) {
			for (let keyword of item.keywords) {
				if (keyword.toLowerCase() === name.toLowerCase()) {
					return item;
				}
			}
			if (item.hasInventory) {
				let inventoryItem = item.searchInventoryByName(name);
				if (inventoryItem) {
					return inventoryItem;
				}
			}
		}
		return null;
	}

	describeGeneral(): string {
		let description: string[] = [];

		description.push(`${this.location.describeObjectLocation()} ${nameItemTypeA(this.type)}`);
		if (this.description) {
			description.push(this.description);
		}

		let brokenString = this.broken ? ' (kaputt)' : '';

		return capitalizeFirstLetter(`Du siehst ${description.join(', ').trim()}${brokenString}`);
	}

	describeInventory(): string {
		if (!this.hasInventory) {
			return '';
		}
		if (!this.isOpen) {
			return 'Es ist verschlossen. Du kannst den Inhalt nicht sehen.';
		}

		let description: string[] = [];

		switch (this.type) {
			case ItemType.Table:
				description.push('Auf dem Tisch siehst du ');
				break;
			default:
				description.push('Darauf liegt ');
		}

		let items: string[] = [];
		for (let item of Object.values(this.inventory)) {
			items.push(`${nameItemTypeA(item.type)}`);
		}

		if (items.length === 0) {
			description.push('nichts');
		} else {
			description.push(joinWithCommaAndAnd(items));
		}


		return description.join('');
	}

	describe(): string {
		let description: string[] = [];

		description.push(this.describeGeneral());

		if (this.hasInventory) {
			description.push(this.describeInventory());
		}

		return joinSentences(description);
	}

	markUsage(action: Action): void {
		this.timesUsed++;

		if (this.uses !== null && this.timesUsed >= this.uses) {
			this.broken = true;
			action.addEvent(`Du hast ${this.name} benutzt und es ist nun kaputt.`);
		}
	}


}