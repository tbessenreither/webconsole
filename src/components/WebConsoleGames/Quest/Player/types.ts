import { RoomId } from "../GenericRoom/types";
import { ItemConfigList, ItemConfig } from "../GenericItem/types";

export type PlayerConfig = {
	playerName: string;
	name: string;
	room: RoomId;
	health: number;
	maxHealth: number;
	strength: number;
	defense: number;
	perception: number;
	inventory: ItemConfigList,
	equipped: {
		weapon: ItemConfig | null;
		armor: ItemConfig | null;
		accessory: ItemConfig | null;
	};
}