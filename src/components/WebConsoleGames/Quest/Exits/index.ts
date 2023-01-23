import GameObject from '../GameObject';

import { ExitId, ExitConfig, ExitType, ExitLink } from './types';
import { LocationsById, nameExitA } from './helpers';
import { RoomId } from '../GenericRoom/types';
import { directionToStringTo, inverseDirection } from '../Location/helpers';
import { ItemId } from '../GenericItem/types';
import Action from '../Action';


export default class GenericExit implements GameObject {
	id: ExitId;
	rooms: RoomId[];
	type: ExitType;
	unusableFrom: RoomId[];
	locations: LocationsById;
	description: string;
	closed: boolean;
	locked: boolean;
	unlockItemKey?: string;

	constructor(config: ExitConfig) {
		this.locations = new LocationsById();
		this.fromObject(config);
	}

	get isUsable(): boolean {
		return !this.closed;
	}

	targetRooms(not?: RoomId): RoomId {
		let rooms = this.rooms;

		if (not) {
			rooms = rooms.filter(room => room !== not);
		}

		return rooms[0];
	}

	setRoomLocation(id: string, exitLink: ExitLink): void {
		this.locations.add(id, exitLink.location, exitLink);
	}

	toObject(): ExitConfig {
		return {
			id: this.id,
			rooms: this.rooms,
			type: this.type,
			unusableFrom: this.unusableFrom,
			locations: this.locations.locations,
			description: this.description,
			closed: this.closed,
			locked: this.locked,
			unlockItemKey: this.unlockItemKey,
		};
	}

	fromObject(object: ExitConfig): GenericExit {
		this.id = object.id;
		this.rooms = object.rooms;
		this.type = object.type;
		this.unusableFrom = object.unusableFrom;
		this.locations = new LocationsById(object.locations);
		this.description = object.description;
		this.closed = object.closed;
		this.locked = object.locked;
		this.unlockItemKey = object.unlockItemKey;

		return this;
	}

	tick(): void {
		// Do nothing
	}

	open(action: Action): boolean {
		if (this.locked || !this.closed) {
			return false;
		}

		this.closed = false;
		return true;
	}

	close(action: Action): boolean {
		if (this.locked || this.closed) {
			return false;
		}
		this.closed = true;
		return true;
	}

	lock(action: Action): boolean {
		if (
			this.unlockItemKey && !action.isUsingObjectKey(this.unlockItemKey)
			|| this.locked
		) {
			return false;
		}

		this.locked = true;
		return true;
	}

	unlock(action: Action): boolean {
		let requiredKey = null;
		if (this.unlockItemKey) {
			requiredKey = action.isUsingObjectKey(this.unlockItemKey);
		}
		if (
			this.unlockItemKey && !requiredKey
			|| !this.locked
		) {
			return false;
		}

		if (requiredKey) {
			requiredKey.use(action);
		}

		this.locked = false;
		return true;
	}

	describe(fromRoom: RoomId): string {
		let exitDescriptions: string[] = [];

		exitDescriptions.push(`Du siehst ${this.locations.getDescriptor(fromRoom).describeObjectLocation()} ${nameExitA(this.type)}. ${this.description}`);
		if (ExitType.Door === this.type && this.closed) {
			exitDescriptions.push('sie ist geschlossen');
		} else if (ExitType.Door === this.type && !this.closed) {
			exitDescriptions.push('sie steht offen');
		} else if (ExitType.Window === this.type && this.closed) {
			exitDescriptions.push('es ist geschlossen');
		} else if (ExitType.Window === this.type && !this.closed) {
			exitDescriptions.push('es steht offen');
		} else if (ExitType.Portal === this.type && this.closed) {
			exitDescriptions.push('es ist inaktiv');
		} else if (ExitType.Portal === this.type && !this.closed) {
			exitDescriptions.push('es ist aktiv');
		}

		if (ExitType.Hallway === this.type && this.locations.getNot(fromRoom)) {
			let targetRoomSourceDirection = this.locations.getNot(fromRoom).direction;
			let targetInverseDirection = inverseDirection(targetRoomSourceDirection);
			exitDescriptions.push(`er führt in Richtung ${directionToStringTo(targetInverseDirection)}`);
		}

		return exitDescriptions.join(', ').trim() + '.';
	}

	use(action: Action): void {
		// Do nothing
	}
}