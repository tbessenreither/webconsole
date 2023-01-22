
import GameObject from '../GameObject';

import GenericItem from '../GenericItem';

export default class GenericMonster implements GameObject {
	name: string;
	health: number;
	maxHealth: number;
	strength: number;
	defense: number;
	loot: GenericItem[];

	constructor() {
		this.name = 'Monster';
		this.health = 100;
		this.maxHealth = 100;
		this.strength = 10;
		this.defense = 10;
		this.loot = [];
	}

	toObject(): any {
		return {
			name: this.name,
			health: this.health,
			maxHealth: this.maxHealth,
			strength: this.strength,
			defense: this.defense,
			loot: this.loot.map(item => item.toObject())
		};
	}

	fromObject(object: any): GameObject {
		this.name = object.name;
		this.health = object.health;
		this.maxHealth = object.maxHealth;
		this.strength = object.strength;
		this.defense = object.defense;
		this.loot = object.loot.map((item: any) => {
			const genericItem = new GenericItem();
			genericItem.fromObject(item);
			return genericItem;
		});

		return this;
	}

	tick(): void {
		this.loot.map(item => item.tick())
	}

}