import GenericItem from '.';
import { ObjectMetaTypes } from '../GameObject/types';
import { Location } from '../Location/types';

export type ItemId = string;

export enum ItemType {
	Item = 'Item',
	Inventory = 'Inventory',
	Table = 'Table',
	Chair = 'Chair',
	Weapon = 'Weapon',
	Stone = 'Stone',
	Key = 'Key',
	Letter = 'Letter',
}

export type ItemMeta = { [key: string]: ObjectMetaTypes | ItemList };

export type ItemConfig = {
	id: ItemId;
	name: string;
	keywords: string[];
	type: ItemType;
	description: string;
	value?: number;
	weight: number;
	equippable?: boolean;
	equipped?: boolean;
	location: Location;
	uses?: number;
	timesUsed?: number;
	broken?: boolean;
	hasInventory?: boolean;
	inventory?: ItemConfig[];
	meta?: ItemMeta;
	canBeOpened?: boolean;
	isOpen?: boolean;
}

export type ItemList = ItemConfig[];

export type ItemObjectList = {
	[key: ItemId]: GenericItem;
}