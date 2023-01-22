import GameObject from '../GameObject';
import { LocationDescriptor } from '../Descriptors/Location';
import { Direction, Height } from '../Location/types';

import { ItemId, ItemType, ItemConfig } from './types';

export default class GenericItem implements GameObject {
	id: ItemId;
	name: string;
	keywords: string[];
	type: ItemType;
	location: LocationDescriptor;
	description: string;
	value: number;
	weight: number;
	equippable: boolean;
	equipped: boolean;

	constructor(config: ItemConfig) {
		this.fromObject(config);
	}

	toObject(): ItemConfig {
		return {
			id: this.id,
			name: this.name,
			keywords: [],
			type: this.type,
			location: this.location.location,
			description: this.description,
			value: this.value,
			weight: this.weight,
			equippable: this.equippable,
			equipped: this.equipped
		};
	}

	fromObject(object: ItemConfig): GameObject {
		this.id = object.id;
		this.name = object.name;
		this.keywords = object.keywords;
		this.type = object.type;
		this.location = new LocationDescriptor(object.location.direction, object.location.height);
		this.description = object.description;
		this.value = object.value;
		this.weight = object.weight;
		this.equippable = object.equippable;
		this.equipped = object.equipped;

		return this;
	}

	tick(): void {
		// Do nothing
	}

	describeType(): string {
		switch (this.type) {
			case ItemType.Table:
				return 'einen Tisch';
			case ItemType.Chair:
				return 'einen Stuhl';
			case ItemType.Weapon:
				return 'eine Waffe';
			case ItemType.Stone:
				return 'einen Stein';
			case ItemType.Key:
				return 'einen Schlüssel';
			case ItemType.Item:
			default:
				return 'ein undefinierbares Etwas';
		}
	}

	capitalizeFirstLetter(string: string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}


	describe(): string {
		let description: string[] = [];

		description.push(`${this.location.describeObjectLocation()} ${this.describeType()}`);
		if (this.description) {
			description.push(this.description);
		}

		return this.capitalizeFirstLetter(`Du siehst ${description.join(', ').trim()}.`);
	}

}