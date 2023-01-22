import GameObject from '../GameObject';

import GenericItem from '../GenericItem';

export default class Player implements GameObject {
	playerName: string;
	name: string;
	health: number;
	maxHealth: number;
	strength: number;
	defense: number;
	inventory: GenericItem[];
	equipped: {
		weapon: GameObject | null;
		armor: GameObject | null;
		accessory: GameObject | null;
	};

	constructor() {
		this.playerName = 'Player';
		this.name = 'Player';
		this.health = 100;
		this.maxHealth = 100;
		this.strength = 10;
		this.defense = 10;
		this.inventory = [];
		this.equipped = {
			weapon: null,
			armor: null,
			accessory: null
		};
	}

	toObject(): any {
		return {
			playerName: this.playerName,
			name: this.name,
			health: this.health,
			maxHealth: this.maxHealth,
			strength: this.strength,
			defense: this.defense,
			inventory: this.inventory.map(item => item.toObject()),
			equipped: {
				weapon: this.equipped.weapon ? this.equipped.weapon.toObject() : null,
				armor: this.equipped.armor ? this.equipped.armor.toObject() : null,
				accessory: this.equipped.accessory ? this.equipped.accessory.toObject() : null
			}
		};
	}

	fromObject(object: any): GameObject {
		this.playerName = object.playerName;
		this.name = object.name;
		this.health = object.health;
		this.maxHealth = object.maxHealth;
		this.strength = object.strength;
		this.defense = object.defense;
		this.inventory = object.inventory.map((item: any) => {
			const genericItem = new GenericItem();
			genericItem.fromObject(item);
			return genericItem;
		});
		this.equipped = {
			weapon: object.equipped.weapon ? new GenericItem().fromObject(object.equipped.weapon) : null,
			armor: object.equipped.armor ? new GenericItem().fromObject(object.equipped.armor) : null,
			accessory: object.equipped.accessory ? new GenericItem().fromObject(object.equipped.accessory) : null
		};

		return this;
	}

	tick(): void {
		this.inventory.forEach(item => item.tick());
		this.equipped.weapon && this.equipped.weapon.tick();
		this.equipped.armor && this.equipped.armor.tick();
		this.equipped.accessory && this.equipped.accessory.tick();
	}

}