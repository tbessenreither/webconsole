import GameState from "../GameState";
import GenericItem from "../GenericItem";
import { ItemType } from "../GenericItem/types";
import Print from "../Print";
import { GameEventConfig, GameEventTarget, GameEventType } from "./types";

class GameEvent {
	private _gameState: GameState;
	private _listeners: { [key: string]: Function[] } = {};

	set gameState(value: GameState) {
		this._gameState = value;
	}

	on(event: string, callback: Function) {
		if (!this._listeners[event]) {
			this._listeners[event] = [];
		}
		this._listeners[event].push(callback);
	}

	off(event: string, callback: Function) {
		for (let callbackFunction of this._listeners[event]) {
			if (callbackFunction === callback) {
				this._listeners[event].splice(this._listeners[event].indexOf(callbackFunction), 1);
			}
		}
	}

	trigger(event: string, ...args: any[]) {
		if (this._listeners[event]) {
			this._listeners[event].forEach((callback) => {
				callback(...args);
			});
		}
	}

	execute(event: GameEventConfig | GameEventConfig[]): void {
		if (!event) {
			return;
		}
		if (!this._gameState) {
			throw new Error("Game state not set");
		}

		// handle arrays by recursion
		if (Array.isArray(event)) {
			for (let eventConfig of event) {
				this.execute(eventConfig);
			}
			return;
		}

		if (!event.timesPlayed) {
			event.timesPlayed = 0;
		}
		if (event.playTimes && event.timesPlayed >= event.playTimes) {
			return;
		}
		event.timesPlayed++;

		// start logic

		if (!event.type) {
			event.type = GameEventType.noop;
		}

		if (!event.messages) {
			event.messages = [];
		}
		if (typeof event.messages === 'string') {
			event.messages = [{ text: event.messages }];
		}
		if (!Array.isArray(event.messages)) {
			event.messages = [event.messages];
		}

		switch (event.type) {
			case GameEventType.warpToRoom:
				this._performGameEventWarpToRoom(event);
				break;
			case GameEventType.clearInventory:
				this._performGameEventClearInventory(event);
				break;
			case GameEventType.addToInventory:
				this._performGameEventAddToInventory(event);
				break;
			case GameEventType.removeFromInventory:
				this._performGameEventRemoveFromInventory(event);
				break;
			case GameEventType.roomActions:
				this._performGameEventRoomActions(event);
				break;
			case GameEventType.saveGame:
				this._gameState.save();
				break;
		}

		if (event.messages) {
			for (let message of event.messages) {
				Print.Message(message);
			}
		}
	}

	private _performGameEventWarpToRoom(event: GameEventConfig): void {
		switch (event.targetType) {
			case GameEventTarget.player:
				this._gameState.player.room = event.targetIds[0];
				break;
			case GameEventTarget.monster:
				// TODO
				break;
		}
	}

	private _performGameEventClearInventory(event: GameEventConfig): void {
		switch (event.targetType) {
			case GameEventTarget.player:
				this._gameState.player.clearInventory();
				break;
			case GameEventTarget.monster:
				// TODO
				break;
		}
	}

	private _performGameEventRemoveFromInventory(event: GameEventConfig): void {
		for (let itemId of event.targetIds) {
			let item = new GenericItem({ id: itemId, name: 'tmp', keywords: [], type: ItemType.Item, description: '', weight: 0 });
			switch (event.targetType) {
				case GameEventTarget.player:
					this._gameState.player.removeFromInventory(item);
					break;
				case GameEventTarget.monster:
					// TODO
					break;
			}
		}
	}

	private _performGameEventRoomActions(event: GameEventConfig): void {
		for (let roomId of event.roomIds) {
			let room = Object.values(this._gameState.rooms).find(room => room.id === roomId);
			if (room) {
				for (let action of event.commands) {
					room.performRoomAction(action);
				}
			}
		}
	}

	private _performGameEventAddToInventory(event: GameEventConfig): void {
		for (let itemConfig of event.items) {
			let item = new GenericItem(itemConfig);
			switch (event.targetType) {
				case GameEventTarget.player:
					this._gameState.player.addToInventory(item);
					break;
				case GameEventTarget.monster:
					// TODO
					break;
			}
		}
	}
}

let gameEvent = new GameEvent();

export default gameEvent;