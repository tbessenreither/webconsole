
import { MonsterId, MonsterConfig } from './types';

import { LocationDescriptor } from '../Descriptors/Location';
import GameObject from '../GameObject';
import GenericItem from '../GenericItem';
import Action from '../Action';

export default class GenericMonster implements GameObject {
	id: MonsterId;
	name: string;
	keywords: string[];
	location: LocationDescriptor;
	health: number;
	maxHealth: number;
	strength: number;
	defense: number;
	loot: GenericItem[];

	constructor(config: MonsterConfig) {
		this.fromObject(config);
	}

	get isUsable(): boolean {
		return true;
	}

	toObject(): MonsterConfig {
		return {
			id: this.id,
			name: this.name,
			keywords: this.keywords,
			location: this.location.location,
			health: this.health,
			maxHealth: this.maxHealth,
			strength: this.strength,
			defense: this.defense,
			loot: this.loot.map(item => item.toObject())
		};
	}

	fromObject(object: MonsterConfig): GameObject {
		this.id = object.id;
		this.name = object.name;
		this.keywords = object.keywords;
		this.location = new LocationDescriptor(object.location.direction, object.location.height);
		this.health = object.health;
		this.maxHealth = object.maxHealth;
		this.strength = object.strength;
		this.defense = object.defense;
		for (let itemId in Object.keys(object.loot)) {
			this.loot[itemId] = new GenericItem(object.loot[itemId]);
		}

		return this;
	}

	tick(): void {
		this.loot.map(item => item.tick())
	}

	describe(): string {
		return 'Ein furchteinflößendes Monster';
	}

}