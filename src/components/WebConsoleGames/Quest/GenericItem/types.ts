import GenericItem from '.';
import { RoomActions } from '../Action/types';
import { GameEventList } from '../GameEvent/types';
import { GameObjectMeta } from '../GameObject/types';
import { Location } from '../Location/types';
import { PrintConfig } from '../Print/types';

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
	Couch = 'Couch',
	Shelf = 'Shelf',
	Tv = 'Tv',
	ImageFrame = 'ImageFrame',
	Book = 'Book',
	Vase = 'Vase',
	Bed = 'Bed',
	Magazine = 'Magazine',
	Note = 'Note',
}

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
	location?: Location;
	uses?: number;
	timesUsed?: number;
	broken?: boolean;
	hasInventory?: boolean;
	inventory?: ItemConfig[];
	meta?: GameObjectMeta;
	canBeOpened?: boolean;
	isOpen?: boolean;
	events?: GameEventList;
	active?: boolean;
}

export type ItemConfigList = ItemConfig[];

export type ItemObjectList = {
	[key: ItemId]: GenericItem;
}