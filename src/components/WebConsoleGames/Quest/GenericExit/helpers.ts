
import { Direction, Location, LocationList } from '../Location/types';
import { LocationDescriptor } from '../Descriptors/Location';
import { ExitType, ExitLink } from './types';
import { directionToStringIs } from '../Location/helpers';

export class LocationsById {
	locations: LocationList = {};
	locationDescriptors: { [key: string]: LocationDescriptor } = {};
	link: { [key: string]: ExitLink } = {};

	constructor(locations: LocationList = {}) {
		for (let id in locations) {
			this.add(id, locations[id]);
		}
	}

	add(id: string, location: Location, link?: ExitLink) {
		this.locations[id] = location;
		this.locationDescriptors[id] = new LocationDescriptor(location.direction, location.height);
		if (link) {
			this.link[id] = link;
		}
	}

	get(id: string): Location {
		return this.locations[id];
	}

	getLink(id: string): ExitLink {
		return this.link[id];
	}

	getNot(id: string): Location {
		let locations = this.locations;

		for (let key in locations) {
			if (key !== id) {
				return locations[key];
			}
		}
	}

	getDescriptor(id: string): LocationDescriptor {
		return this.locationDescriptors[id];
	}
}

export function nameExitA(type: ExitType): string {
	switch (type) {
		case ExitType.Door:
			return "eine Tür";
		case ExitType.Stairs:
			return "Treppen";
		case ExitType.Portal:
			return "ein Portal";
		case ExitType.Alley:
			return "eine Gasse";
		case ExitType.Pathway:
			return "einen Pfad";
		case ExitType.WallHole:
			return "ein Loch in der Wand";
		case ExitType.Ladder:
			return "eine Leiter";
		case ExitType.Window:
			return "ein Fenster";
		case ExitType.Hallway:
			return "einen Gang";
		default:
			return "ein undefinierter Weg";
	}
}

export function nameExitThe(type: ExitType, direction: Direction = Direction.null): string {
	let directionString = '';
	if (direction !== Direction.null) {
		directionString = `${directionToStringIs(direction)} `;
	}

	switch (type) {
		case ExitType.Door:
			return `die ${directionString}Tür`;
		case ExitType.Stairs:
			return `die ${directionString}Treppen`;
		case ExitType.Portal:
			return `das ${directionString}Portal`;
		case ExitType.Alley:
			return `die ${directionString}Gasse`;
		case ExitType.Pathway:
			return `den ${directionString}Pfad`;
		case ExitType.WallHole:
			return `das ${directionString}Loch in der Wand`;
		case ExitType.Ladder:
			return `die ${directionString}Leiter`;
		case ExitType.Window:
			return `das ${directionString}Fenster`;
		case ExitType.Hallway:
			return `den ${directionString}Gang`;
		default:
			return `den ${directionString}undefinierten Weg`;
	}
}

export function nameExitThe2(type: ExitType, direction: Direction = Direction.null): string {
	let directionString = '';
	if (direction !== Direction.null) {
		directionString = `${directionToStringIs(direction)} `;
	}

	switch (type) {
		case ExitType.Door:
			return `der ${directionString}Tür`;
		case ExitType.Stairs:
			return `der ${directionString}Treppe`;
		case ExitType.Portal:
			return `dem ${directionString}Portal`;
		case ExitType.Alley:
			return `der ${directionString}Gasse`;
		case ExitType.Pathway:
			return `dem ${directionString}Pfad`;
		case ExitType.WallHole:
			return `dem ${directionString}Loch in der Wand`;
		case ExitType.Ladder:
			return `der ${directionString}Leiter`;
		case ExitType.Window:
			return `dem ${directionString}Fenster`;
		case ExitType.Hallway:
			return `dem ${directionString}Gang`;
		default:
			return `dem ${directionString}undefinierten Weg`;
	}
}

export function lookupExitTypeByName(name: string): ExitType {
	switch (name.toLowerCase()) {
		case 'tür':
		case 'tuer':
		case 'türe':
		case 'tuere':
		case 'door':
			return ExitType.Door;
		case 'treppe':
		case 'treppen':
		case 'stairs':
			return ExitType.Stairs;
		case 'portal':
			return ExitType.Portal;
		case 'gasse':
		case 'alley':
			return ExitType.Alley;
		case 'pfad':
		case 'pathway':
			return ExitType.Pathway;
		case 'loch':
		case 'loch in der wand':
		case 'durchbruch':
		case 'wallhole':
			return ExitType.WallHole;
		case 'leiter':
		case 'leitern':
		case 'ladder':
			return ExitType.Ladder;
		case 'fenster':
		case 'window':
			return ExitType.Window;
		case 'gang':
		case 'flur':
		case 'hallway':
			return ExitType.Hallway;
		default:
			return null;
	}
}