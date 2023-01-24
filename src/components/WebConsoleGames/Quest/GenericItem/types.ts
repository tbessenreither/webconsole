import GenericItem from '.';
import { Location } from '../Location/types';

export type ItemId = string;

export enum ItemType {
	Item = 'Item',
	Table = 'Table',
	Chair = 'Chair',
	Weapon = 'Weapon',
	Stone = 'Stone',
	Key = 'Key',
}

export type ItemConfig = {
	id: ItemId;
	name: string;
	keywords: string[];
	type: ItemType;
	description: string;
	value: number;
	weight: number;
	equippable: boolean;
	equipped: boolean;
	location: Location;
	uses: number;
	timesUsed?: number;
	broken?: boolean;
}

export type ItemList = ItemConfig[];

export type ItemObjectList = {
	[key: ItemId]: GenericItem;
}