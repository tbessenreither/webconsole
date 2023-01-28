import GenericRoom from ".";

import { ItemList } from "../GenericItem/types";
import { MonsterList } from "../GenericMonster/types";

import { ExitLinkList } from "../GenericExit/types";

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
	items: ItemList;
	monsters: MonsterList;
	exits: ExitLinkList;
};
