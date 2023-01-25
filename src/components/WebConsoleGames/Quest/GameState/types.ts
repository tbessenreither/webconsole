
import { RoomList } from "../GenericRoom/types";
import { ExitList } from "../GenericExit/types";
import { PlayerConfig } from "../Player/types";


export type GameStateConfig = {
	gameInitiated: boolean;
	rooms: RoomList;
	exits: ExitList;
	player: PlayerConfig;
	messages: string[];
	gameOver: boolean;
}