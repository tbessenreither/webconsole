import GenericItem from ".";
import GameObject from "../GameObject";
import { Direction } from "../Location/types";
import { ItemList, ItemObjectList, ItemType } from "./types";


export function ItemObjectListToGameObjectArray(itemObjectList: ItemObjectList): GameObject[] {
	return Object.values(itemObjectList);
}


export function articleItemTypeA(itemType: ItemType): string {
	switch (itemType) {
		case ItemType.Table:
			return 'einen';
		case ItemType.Chair:
			return 'einen';
		case ItemType.Weapon:
			return 'eine';
		case ItemType.Stone:
			return 'einen';
		case ItemType.Key:
			return 'einen';
		case ItemType.Letter:
			return 'einen';
		case ItemType.Item:
		default:
			return 'ein';
	}
}

export function articleItemThe(itemType: ItemType): string {
	switch (itemType) {
		case ItemType.Table:
			return 'der';
		case ItemType.Chair:
			return 'der';
		case ItemType.Weapon:
			return 'die';
		case ItemType.Stone:
			return 'der';
		case ItemType.Key:
			return 'der';
		case ItemType.Letter:
			return 'der';
		case ItemType.Item:
		default:
			return 'das';
	}
}

export function articleItemThe2(itemType: ItemType): string {
	switch (itemType) {
		case ItemType.Table:
			return 'den';
		case ItemType.Chair:
			return 'den';
		case ItemType.Weapon:
			return 'die';
		case ItemType.Stone:
			return 'den';
		case ItemType.Key:
			return 'den';
		case ItemType.Letter:
			return 'den';
		case ItemType.Item:
		default:
			return 'das';
	}
}

export function nameItemType(itemType: ItemType): string {
	switch (itemType) {
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
	let article = articleItemThe(itemType);
	let name = nameItemType(itemType);

	return `${article} ${name}`;
}

export function nameItemTypeThe2(itemType: ItemType): string {
	let article = articleItemThe2(itemType);
	let name = nameItemType(itemType);

	return `${article} ${name}`;
}