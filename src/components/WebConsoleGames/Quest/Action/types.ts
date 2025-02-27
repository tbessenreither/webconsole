import GameObject from "../GameObject";
import GenericRoom from "../GenericRoom";
import { Direction } from "../Location/types";
import { PrintConfig } from "../Print/types";


export enum ActionType {
	Investigate = 'investigate',
	Open = 'open',
	Close = 'close',
	Unlock = 'unlock',
	Lock = 'lock',
	PickUp = 'pick up',
	PutDown = 'put down',
	Use = 'use',
	Enter = 'enter',
	Exit = 'exit',
	Attack = 'attack',
	Read = 'read',
	NOOP = 'noop',
}

export enum LookupIn {
	Inventory = 'inventory',
	CurrentRoom = 'room',
	Exit = 'exit',
}

export type ActionConfig = {
	type: ActionType;
	origin: GameObject;
	targets: GameObject[];
	targetDirection?: Direction;
	using: GameObject[];
	room: GenericRoom;
	direction: Direction;
	events?: PrintConfig[];
	parsedData?: { [key: string]: string };
}

export type ActionParsed = {
	type?: ActionType,
	target?: string,
	direction?: string,
	targetDirection?: string,
	using?: string,
}

export type RoomAction = string;

export type RoomActionList = RoomAction[];

export type RoomActions = {
	onPickUp?: RoomActionList,
	afterPickUp?: RoomActionList,
	beforeReading?: RoomActionList,
	afterReading?: RoomActionList,
};