import GameObject from "../GameObject";
import GenericRoom from "../GenericRoom";
import { Direction } from "../Location/types";


export enum ActionType {
	Look = 'look',
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
	NOOP = 'noop',
}

export type ActionConfig = {
	type: ActionType;
	origin: GameObject;
	targets: GameObject[];
	using: GameObject[];
	room: GenericRoom;
	direction: Direction;
	parsedData?: { [key: string]: string };
}

export type ActionParsed = {
	type?: ActionType,
	target?: string,
	direction?: string,
	targetDirection?: string,
	using?: string,
}