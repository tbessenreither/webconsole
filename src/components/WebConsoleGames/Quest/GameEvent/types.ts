import { ItemConfigList } from "../GenericItem/types";
import { PrintConfig } from "../Print/types";

export enum GameEventType {
	noop = 'noop',
	warpToRoom = 'warpToRoom',
	saveGame = 'saveGame',
	beforeTick = 'beforeTick',
	afterTick = 'afterTick',
	beforePickUp = 'beforePickUp',
	afterPickUp = 'afterPickUp',
	beforeDrop = 'beforeDrop',
	afterDrop = 'afterDrop',
	beforeReading = 'beforeReading',
	afterReading = 'afterReading',
	clearInventory = 'clearInventory',
	addToInventory = 'addToInventory',
	removeFromInventory = 'removeFromInventory',
	roomActions = 'roomActions',
}

export enum GameEventTarget {
	room = 'room',
	item = 'item',
	player = 'player',
	monster = 'monster',
}


export type GameEventConfig = {
	type?: GameEventType,
	targetType?: GameEventTarget,
	roomIds?: string[],
	targetIds?: string[],
	commands?: string[],
	messages?: string | PrintConfig | PrintConfig[],
	items?: ItemConfigList,
	timesPlayed?: number,
	playTimes?: number,
}

export type GameEventConfigList = GameEventConfig[];

export type GameEventList = {
	[key in GameEventType]?: GameEventConfigList
}