import GameObject from "../GameObject";
import GenericRoom from "../GenericRoom";
import { Direction } from "../Location/types";
import Player from "../Player";
import { ActionConfig, ActionType } from "./types";


export default class Action {
	private _type: ActionType;
	private _origin: GameObject;
	private _targets: GameObject[];
	private _using: GameObject[];
	private _room: GenericRoom;
	private _direction: Direction;
	private _parsedData: { [key: string]: string };

	constructor(config: ActionConfig) {
		this._type = config.type;
		this._origin = config.origin;
		this._targets = config.targets;
		this._using = config.using;
		this._room = config.room;
		this._direction = config.direction;
		this._parsedData = config.parsedData;
	}

	toObject(): ActionConfig {
		return {
			type: this._type,
			origin: this._origin,
			targets: this._targets,
			using: this._using,
			room: this._room,
			direction: this._direction,
			parsedData: this._parsedData,
		};
	}

	get type(): ActionType {
		return this._type;
	}

	get origin(): GameObject {
		return this._origin;
	}

	get targets(): GameObject[] {
		return this._targets;
	}

	get using(): GameObject[] {
		return this._using;
	}

	set using(value: GameObject[]) {
		this._using = value;
	}

	get room(): GenericRoom {
		return this._room;
	}

	get direction(): Direction {
		return this._direction;
	}

	get parsedData(): { [key: string]: string } {
		return this._parsedData;
	}

	public getUsableObjects(): GameObject[] {
		return this._using.filter(obj => obj.isUsable);
	}

	public isUsingObject(object: GameObject): GameObject {
		return this.isUsingObjectKey(object.id);
	}

	public isUsingObjectKey(objectId: string): GameObject {

		let result = this.getUsableObjects().find(obj => obj.id === objectId);

		return result;
	}
}