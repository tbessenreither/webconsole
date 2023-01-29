import { ItemConfigList } from "../GenericItem/types";
import { PrintConfig } from "../Print/types";

export enum GameEventType {
	warpToRoom = 'warpToRoom',
	saveGame = 'saveGame',
	beforeTick = 'beforeTick',
	afterTick = 'afterTick',
	beforePickUp = 'beforePickUp',
	afterPickUp = 'afterPickUp',
	beforeDrop = 'beforeDrop',
	afterDrop = 'afterDrop',
	clearInventory = 'clearInventory',
	addToInventory = 'addToInventory',
	removeFromInventory = 'removeFromInventory',
}

export enum GameEventTarget {
	room = 'room',
	item = 'item',
	player = 'player',
	monster = 'monster',
}


export type GameEvent = {
	type: GameEventType,
	targetType?: GameEventTarget,
	targetIds?: string[],
	messages?: PrintConfig[],
	items?: ItemConfigList,
}