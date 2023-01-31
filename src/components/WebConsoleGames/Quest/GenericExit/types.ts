import GenericExit from ".";
import { GameEventList } from "../GameEvent/types";
import { GameObjectMeta } from "../GameObject/types";
import { ItemId } from "../GenericItem/types";
import { RoomId } from "../GenericRoom/types";
import { Location, LocationList } from "../Location/types";

export type ExitId = string;

export enum ExitType {
	Door = 'Door',
	Stairs = 'Stairs',
	Portal = 'Portal',
	Alley = 'Alley',
	Pathway = 'Pathway',
	WallHole = 'WallHole',
	Ladder = 'Ladder',
	Window = 'Window',
	Hallway = 'Hallway',
}

export enum ExitDirection {
	In = "In",
	Out = "Out",
	Both = "Both",
}

export type ExitList = ExitConfig[];

export type ExitObjectList = {
	[key: RoomId]: GenericExit
}

export type ExitConfig = {
	id: ExitId;
	rooms?: RoomId[];
	keywords?: string[];
	type: ExitType;
	isHidden?: boolean;
	locations: LocationList;
	description: string;
	unusableFrom: RoomId[];
	closed: boolean;
	locked: boolean;
	unlockItemKey?: ItemId;
	meta?: GameObjectMeta;
	events?: GameEventList;
}

export type ExitLink = {
	id: ExitId;
	location: Location;
	transitionMessage?: string;
};

export type ExitLinkList = ExitLink[];