import GameObject from ".";
import { Direction } from "../Location/types";
import { GameObjectList } from "./types";


export function filterGameObjectList(list: GameObjectList, direction: Direction = null) {
	let filteredList = Object.values(list);

	filteredList = filteredList.filter(object => !object.isHidden);
	if (direction) {
		filteredList = filteredList.filter(object => !object.location || object.location.direction === direction);
	}

	return filteredList;
}

export function lookupGameObjectByName(inventory: GameObjectList, name: string, direction: Direction = null): GameObject | null {
	let objectsToLookup = filterGameObjectList(inventory, direction);

	for (let item of objectsToLookup) {

		if (item.name.toLowerCase() === name.toLowerCase()) {
			return item;
		}
		if (item.keywords) {
			for (let keyword of item.keywords) {
				if (keyword.toLowerCase() === name.toLowerCase()) {
					return item;
				}
			}
		}
		if (item.hasInventory) {
			let inventoryItem = lookupGameObjectByName(item.inventory, name);
			if (inventoryItem) {
				return inventoryItem;
			}
		}
	}
	return null;
}

export function lookupGameObjectByDirection(inventory: GameObjectList, direction: Direction = null): GameObject | null {
	let objectsToLookup = filterGameObjectList(inventory, direction);

	for (let item of objectsToLookup) {

		if (item.location && item.location.direction === direction) {
			return item;
		}
		if (item.hasInventory) {
			let inventoryItem = lookupGameObjectByDirection(item.inventory, direction);
			if (inventoryItem) {
				return inventoryItem;
			}
		}
	}
	return null;
}

export function lookupGameObjectByType(inventory: GameObjectList, type: string, direction: Direction = null): GameObject | null {
	let objectsToLookup = filterGameObjectList(inventory, direction);

	for (let item of objectsToLookup) {

		if (item.type === type) {
			return item;
		}
		if (item.hasInventory) {
			let inventoryItem = lookupGameObjectByType(item.inventory, type);
			if (inventoryItem) {
				return inventoryItem;
			}
		}
	}
	return null;
}