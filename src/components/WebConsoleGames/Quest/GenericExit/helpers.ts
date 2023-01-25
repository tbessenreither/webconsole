
import { Location, LocationList } from '../Location/types';
import { LocationDescriptor } from '../Descriptors/Location';
import { ExitType, ExitLink } from './types';

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

export function nameExitThe(type: ExitType): string {
	switch (type) {
		case ExitType.Door:
			return "die Tür";
		case ExitType.Stairs:
			return "die Treppen";
		case ExitType.Portal:
			return "das Portal";
		case ExitType.Alley:
			return "die Gasse";
		case ExitType.Pathway:
			return "den Pfad";
		case ExitType.WallHole:
			return "das Loch in der Wand";
		case ExitType.Ladder:
			return "die Leiter";
		case ExitType.Window:
			return "das Fenster";
		case ExitType.Hallway:
			return "den Gang";
		default:
			return "den undefinierten Weg";
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