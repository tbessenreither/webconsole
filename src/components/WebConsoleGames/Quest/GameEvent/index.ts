
class GameEvent {
	listeners: { [key: string]: Function[] } = {};

	on(event: string, callback: Function) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}

	off(event: string, callback: Function) {
		for (let callbackFunction of this.listeners[event]) {
			if (callbackFunction === callback) {
				this.listeners[event].splice(this.listeners[event].indexOf(callbackFunction), 1);
			}
		}
	}

	trigger(event: string, ...args: any[]) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((callback) => {
				callback(...args);
			});
		}
	}
}

let gameEvent = new GameEvent();

export default gameEvent;