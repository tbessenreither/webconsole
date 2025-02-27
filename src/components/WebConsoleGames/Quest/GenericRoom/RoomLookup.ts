import GameState from "../GameState";

export default class RoomLookup {
	private static _gameState: GameState;

	static set gameState(gameState: GameState) {
		this._gameState = gameState;
	}

	static getById(roomId: string) {
		return this._gameState.rooms[roomId];
	}

}