import GenericItem from ".";
import GameObject from "../GameObject";
import { Direction } from "../Location/types";
import { ItemList, ItemObjectList, ItemType } from "./types";


export function ItemObjectListToGameObjectArray(itemObjectList: ItemObjectList): GameObject[] {
	return Object.values(itemObjectList);
}

let articlesMapping: { [key: string]: { [key: string]: string } } = {
	der: {
		a: 'einen',
		the2: 'den',
	},
	die: {
		a: 'eine',
		the2: 'die',
	},
	das: {
		a: 'ein',
		the2: 'das',
	},
};



export function articleItemTypeThe(itemType: ItemType): string {
	switch (itemType) {
		case ItemType.Table:
		case ItemType.Chair:
		case ItemType.Stone:
		case ItemType.Key:
		case ItemType.Letter:
		case ItemType.Tv:
			return 'der';
		case ItemType.Weapon:
		case ItemType.Couch:
		case ItemType.ImageFrame:
		case ItemType.Vase:
			return 'die';
		case ItemType.Item:
		case ItemType.Inventory:
		case ItemType.Shelf:
		case ItemType.Book:
		case ItemType.Bed:
		default:
			return 'das';
	}
}
export function articleItemTypeA(itemType: ItemType): string {
	let articleThe = articleItemTypeThe(itemType);
	switch (itemType) {
		default:
			return articlesMapping[articleThe].a;
	}
}

export function articleItemTypeThe2(itemType: ItemType): string {
	let articleThe = articleItemTypeThe(itemType);
	switch (itemType) {
		default:
			return articlesMapping[articleThe].the2;
	}
}

export function nameItemType(itemType: ItemType): string {
	switch (itemType) {
		case ItemType.Inventory:
			return 'Inventar';
		case ItemType.Table:
			return 'Tisch';
		case ItemType.Chair:
			return 'Stuhl';
		case ItemType.Weapon:
			return 'Waffe';
		case ItemType.Stone:
			return 'Stein';
		case ItemType.Key:
			return 'Schlüssel';
		case ItemType.Letter:
			return 'Brief';
		case ItemType.Couch:
			return 'Sofa';
		case ItemType.Shelf:
			return 'Regal';
		case ItemType.Tv:
			return 'Fernseher';
		case ItemType.ImageFrame:
			return 'Bilderrahmen';
		case ItemType.Book:
			return 'Buch';
		case ItemType.Vase:
			return 'Vase';
		case ItemType.Bed:
			return 'Bett';
		case ItemType.Item:
		default:
			return 'undefinierbares Etwas';
	}
}

export function nameItemTypeA(itemType: ItemType): string {
	let article = articleItemTypeA(itemType);
	let name = nameItemType(itemType);

	return `${article} ${name}`;
}

export function nameItemTypeThe(itemType: ItemType): string {
	let article = articleItemTypeThe(itemType);
	let name = nameItemType(itemType);

	return `${article} ${name}`;
}

export function nameItemTypeThe2(itemType: ItemType): string {
	let article = articleItemTypeThe2(itemType);
	let name = nameItemType(itemType);

	return `${article} ${name}`;
}