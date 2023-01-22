import GameObject from '../GameObject';

import GenericItem from '../GenericItem';
import GenericMonster from '../GenericMonster';

export default class GenericRoom implements GameObject {
	name: string;
	description: string;
	items: GenericItem[];
	monsters: GenericMonster[];
	exits: GenericRoom[];

	constructor() {
		this.name = 'Room';
		this.description = 'A generic room';
		this.items = [];
		this.monsters = [];
		this.exits = [];
	}

	toObject(): any {
		return {
			name: this.name,
			description: this.description,
			items: this.items.map(item => item.toObject()),
			monsters: this.monsters.map(monster => monster.toObject()),
			exits: this.exits.map(exit => exit.toObject())
		};
	}

	fromObject(object: any): GameObject {
		this.name = object.name;
		this.description = object.description;
		this.items = object.items.map((item: any) => {
			const genericItem = new GenericItem();
			genericItem.fromObject(item);
			return genericItem;
		});
		this.monsters = object.monsters.map((monster: any) => {
			const genericMonster = new GenericMonster();
			genericMonster.fromObject(monster);
			return genericMonster;
		});
		this.exits = object.exits.map((exit: any) => {
			const genericRoom = new GenericRoom();
			genericRoom.fromObject(exit);
			return genericRoom;
		});

		return this;
	}

	tick(): void {
		this.monsters.forEach(monster => monster.tick());
		this.items.forEach(item => item.tick());
	}
}