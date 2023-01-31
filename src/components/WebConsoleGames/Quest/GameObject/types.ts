import GameObject from ".";
import { RoomActions } from "../Action/types";
import { ItemConfigList } from "../GenericItem/types";
import { PrintConfig } from "../Print/types";

export type GameObjectList = { [id: string]: GameObject };

export type GameObjectMeta = {
	text?: string | PrintConfig;
	used?: boolean;
	roomActions?: RoomActions;
	attached?: ItemConfigList;
	nameAfterReading?: string;
	read?: boolean;
};
