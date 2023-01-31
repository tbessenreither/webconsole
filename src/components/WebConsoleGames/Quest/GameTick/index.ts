import GameEvent from "../GameEvent";
import GameObject from "../GameObject";

class GameTick {
	private _elementsToTick: GameObject[] = [];
	private _ticksPassed: number = 0;

	set ticksPassed(value: number) {
		this._ticksPassed = value || 0;
	}

	get ticksPassed(): number {
		return this._ticksPassed;
	}

	add(element: GameObject) {
		this._elementsToTick.push(element);
	}

	remove(element: GameObject) {
		let index = this._elementsToTick.indexOf(element);
		if (index > -1) {
			this._elementsToTick.splice(index, 1);
		}
	}

	reset() {
		this._ticksPassed = 0;
		this.clear();
	}

	clear() {
		this._elementsToTick = [];
	}

	execute(count: number = 1) {
		for (let i = 0; i < count; i++) {
			this._tickOnce();
		}

	}

	private _tickOnce() {
		GameEvent.trigger('beforeTick', this.ticksPassed);

		this._ticksPassed++;

		console.log('tick', this.ticksPassed);
		for (let element of this._elementsToTick) {
			this._tickElement(element);
		}
		GameEvent.trigger('afterTick', this.ticksPassed);
	}

	private _tickElement(element: GameObject) {
		if (element.tick) {
			element.tick();
		}
	}
}

let gameTick = new GameTick();

export default gameTick;