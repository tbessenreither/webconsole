import GameObject from "../GameObject";
import GenericRoom from "../GenericRoom";
import Player from "../Player";
import { ActionConfig, ActionType } from "./types";


export default class Action {
	private _type: ActionType;
	private _origin: GameObject;
	private _targets: GameObject[];
	private _using: GameObject[];
	private _room: GenericRoom;

	constructor(config: ActionConfig) {
		this._type = config.type;
		this._origin = config.origin;
		this._targets = config.targets;
		this._using = config.using;
		this._room = config.room;
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

	get room(): GenericRoom {
		return this._room;
	}

	public getUsableObjects(): GameObject[] {
		return this._using.filter(obj => obj.isUsable);
	}

	public isUsingObject(object: GameObject): GameObject {
		return this.isUsingObjectKey(object.id);
	}

	public isUsingObjectKey(objectId: string): GameObject {

		let result = this.getUsableObjects().find(obj => obj.id === objectId);

		console.log({
			result,
			inventory: this._using.map(obj => obj.id),
			objectId,
		});

		return result;
	}
}