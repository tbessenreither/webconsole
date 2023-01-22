import GameObject from '../GameObject';

export default class GenericItem implements GameObject {
	name: string;
	type: string;
	description: string;
	value: number;
	weight: number;
	equippable: boolean;
	equipped: boolean;

	constructor() {
		this.name = 'Item';
		this.type = 'item';
		this.description = 'A generic item';
		this.value = 0;
		this.weight = 0;
		this.equippable = false;
		this.equipped = false;
	}

	toObject(): any {
		return {
			name: this.name,
			type: this.type,
			description: this.description,
			value: this.value,
			weight: this.weight,
			equippable: this.equippable,
			equipped: this.equipped
		};
	}

	fromObject(object: any): GameObject {
		this.name = object.name;
		this.type = object.type;
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

}