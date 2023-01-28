import GameObject from '../GameObject';

import { ExitId, ExitConfig, ExitType, ExitLink } from './types';
import { LocationsById, nameExitA, nameExitThe } from './helpers';
import { RoomId } from '../GenericRoom/types';
import { describeDirectionChange, directionToStringTo, inverseDirection } from '../Location/helpers';
import Action from '../Action';
import { LocationDescriptor } from '../Descriptors/Location';
import { ObjectMeta } from '../GameObject/types';
import gameTick from '../GameTick';
import RoomLookup from '../GenericRoom/RoomLookup';


export default class GenericExit implements GameObject {
	id: ExitId;
	keywords: string[];
	rooms: RoomId[];
	type: ExitType;
	isHidden: boolean;
	unusableFrom: RoomId[];
	locations: LocationsById;
	location: LocationDescriptor;
	description: string;
	closed: boolean;
	locked: boolean;
	unlockItemKey?: string;
	meta: ObjectMeta;

	constructor(config: ExitConfig) {
		this.locations = new LocationsById();
		this.fromObject(config);

		gameTick.add(this);
	}

	get used(): boolean {
		return this.meta.used === true || false;
	}

	set used(value: boolean) {
		this.meta.used = value;
	}

	destruct(): void {
		gameTick.remove(this);
	}

	toObject(): ExitConfig {
		return {
			id: this.id,
			keywords: this.keywords,
			type: this.type,
			isHidden: this.isHidden,
			unusableFrom: this.unusableFrom,
			locations: this.locations.locations,
			description: this.description,
			closed: this.closed,
			locked: this.locked,
			unlockItemKey: this.unlockItemKey,
			meta: this.meta,
		};
	}

	fromObject(object: ExitConfig): GenericExit {
		this.id = object.id;
		this.keywords = object.keywords || [];
		this.rooms = object.rooms || [];
		this.type = object.type;
		this.isHidden = object.isHidden || false;
		this.unusableFrom = object.unusableFrom;
		this.locations = new LocationsById(object.locations);
		this.description = object.description;
		this.closed = object.closed;
		this.locked = object.locked;
		this.unlockItemKey = object.unlockItemKey;
		this.meta = object.meta || {};

		return this;
	}

	get isUsable(): boolean {
		return !this.closed;
	}

	get name(): string {
		return nameExitA(this.type);
	}

	tick(): void {
		// do nothing
	}

	targetRooms(not?: RoomId): RoomId {
		let rooms = this.rooms;

		if (not) {
			rooms = rooms.filter(room => room !== not);
		}

		return rooms[0];
	}

	setRoomLocation(id: string): void {
		this.location = new LocationDescriptor(this.locations.get(id).direction, this.locations.get(id).height);
	}

	addRoomLocation(id: string, exitLink: ExitLink): void {
		this.locations.add(id, exitLink.location, exitLink);

		if (!this.rooms.includes(id)) {
			this.rooms.push(id);
		}
	}

	open(action: Action): boolean {
		if (!this.closed) {
			action.addEvent(`${nameExitThe(this.type)} ist bereits geöffnet.`)
			return false;
		} else if (this.locked) {
			action.addEvent(`${nameExitThe(this.type)} ist verschlossen.`)
			return false;
		}

		action.addEvent(`${nameExitThe(this.type)} ist nun geöffnet.`)
		this.closed = false;
		return true;
	}

	close(action: Action): boolean {
		if (this.closed) {
			action.addEvent(`${nameExitThe(this.type)} ist bereits geschlossen.`)
			return false;
		} else if (this.locked) {
			action.addEvent(`${nameExitThe(this.type)} lässt sich nicht schließen, ist abgeschlossen.`)
			return false;
		}

		action.addEvent(`${nameExitThe(this.type)} ist nun geschlossen.`)
		this.closed = true;
		return true;
	}

	lock(action: Action): boolean {
		if (this.locked) {
			action.addEvent(`${nameExitThe(this.type)} ist bereits verschlossen.`)
			return false;
		}

		let requiredKey = null;
		if (this.unlockItemKey) {
			requiredKey = action.isUsingObjectKey(this.unlockItemKey);
		}
		if (
			this.unlockItemKey && !requiredKey
		) {
			action.addEvent(`${nameExitThe(this.type)} lässt sich nicht verschließen, es fehlt ein Schlüssel.`)
			return false;
		}

		if (requiredKey && requiredKey.markUsage) {
			requiredKey.markUsage(action);
		}

		action.addEvent(`${nameExitThe(this.type)} ist nun verschlossen.`)
		this.locked = true;
		return true;
	}

	unlock(action: Action): boolean {
		if (!this.locked) {
			action.addEvent(`${nameExitThe(this.type)} ist bereits aufgeschlossen.`)
			return false;
		}

		let requiredKey = null;
		if (this.unlockItemKey) {
			requiredKey = action.isUsingObjectKey(this.unlockItemKey);
		}
		if (
			this.unlockItemKey && !requiredKey
		) {
			action.addEvent(`${nameExitThe(this.type)} lässt sich nicht aufschließen, es fehlt ein Schlüssel.`)
			return false;
		}

		if (requiredKey && requiredKey.markUsage) {
			requiredKey.markUsage(action);
		}

		action.addEvent(`${nameExitThe(this.type)} ist nun aufgeschlossen.`)
		this.locked = false;
		return true;
	}

	describe(action: Action): string {
		let exitDescriptions: string[] = [];

		let locationDescriptorThis = this.locations.getDescriptor(action.room.id);
		let locationThis = this.locations.get(action.room.id);
		let locationOther = this.locations.getNot(action.room.id);


		let targetString = '';
		if (this.used) {
			let targetRoomId = this.rooms.filter(roomId => roomId !== action.room.id)[0];
			let targetRoom = RoomLookup.getById(targetRoomId);
			targetString = ` (<span class="info">${targetRoom.name}</span>)`;
		}

		let initialDescription = `Du siehst ${locationDescriptorThis.describeObjectLocation()} ${nameExitA(this.type)}${targetString}`;
		if (this.description) {
			initialDescription += `, ${this.description}`;
		}
		exitDescriptions.push(initialDescription);
		if (ExitType.Door === this.type && this.closed) {
			exitDescriptions.push('Sie ist geschlossen');
		} else if (ExitType.Door === this.type && !this.closed) {
			exitDescriptions.push('Sie steht offen');
		} else if (ExitType.Window === this.type && this.closed) {
			exitDescriptions.push('Es ist geschlossen');
		} else if (ExitType.Window === this.type && !this.closed) {
			exitDescriptions.push('Es steht offen');
		} else if (ExitType.Portal === this.type && this.closed) {
			exitDescriptions.push('Es ist inaktiv');
		} else if (ExitType.Portal === this.type && !this.closed) {
			exitDescriptions.push('Es ist aktiv');
		}

		if (ExitType.Hallway === this.type && locationOther) {
			let targetRoomSourceDirection = locationOther.direction;
			let thisRoomDirection = locationThis.direction;
			let targetInverseDirection = inverseDirection(targetRoomSourceDirection);

			let describedirectionChange = describeDirectionChange(thisRoomDirection, targetInverseDirection);
			exitDescriptions.push(`Er führt ${describedirectionChange} in Richtung ${directionToStringTo(targetInverseDirection)}`);
		}

		return exitDescriptions.join('. ').trim() + '.';
	}

	use(action: Action): void {
		if (!this.closed) {
			this.close(action);
		} else if (this.locked) {
			this.unlock(action);
		} else if (this.closed) {
			this.open(action);
		} else {
			this.lock(action);
		}
	}
}