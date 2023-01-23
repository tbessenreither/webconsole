import GameObject from "../GameObject";
import GenericRoom from "../GenericRoom";
import Player from "../Player";


export enum ActionType {
	Look,
	Investigate,
	Open,
	Close,
	Unlock,
	Lock,
	PickUp,
	PutDown,
	Use,
	Enter,
	Exit,
	Attack,
}

export type ActionConfig = {
	type: ActionType;
	origin: GameObject;
	targets: GameObject[];
	using: GameObject[];
	room: GenericRoom;
}