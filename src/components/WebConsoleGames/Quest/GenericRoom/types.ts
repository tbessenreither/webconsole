import GenericRoom from ".";
import { ItemConfigList } from "../GenericItem/types";
import { MonsterList } from "../GenericMonster/types";
import { ExitLinkList } from "../GenericExit/types";
import { GameEventList } from "../GameEvent/types";

export type RoomId = string;

export type RoomList = RoomConfig[];

export type RoomObjectList = {
	[key: RoomId]: GenericRoom;
}

export type RoomConfig = {
	startingRoom?: boolean;
	id: RoomId;
	name: string;
	description: string;
	items: ItemConfigList;
	monsters: MonsterList;
	exits: ExitLinkList;
	events?: GameEventList;
};
