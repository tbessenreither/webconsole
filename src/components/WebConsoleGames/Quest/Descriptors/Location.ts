
import { Location, Direction, Height } from '../Location/types';

export class LocationDescriptor {
	_location: Location;

	descriptions: { [key: string]: string } = {

	};

	constructor(direction: Direction, height: Height) {
		this._location = {
			direction,
			height,
		};
	}

	get location(): Location {
		return this._location;
	}

	get direction(): Direction {
		return this._location.direction;
	}

	get height(): Height {
		return this._location.height;
	}


	random(max: number, min: number = 0) {
		return Math.round(Math.random() * (max - min) + min);
	}

	randomLocationSentencePart(direction: Direction): string {
		if (direction === Direction.null) {
			return '';
		}

		let part = '';

		switch (direction) {
			case Direction.Center:
				part = '';
				break;
			case Direction.North:
				part = 'nördlich';
				break;
			case Direction.NorthEast:
				part = 'nordöstlich';
				break;
			case Direction.East:
				part = 'östlich';
				break;
			case Direction.SouthEast:
				part = 'südöstlich';
				break;
			case Direction.South:
				part = 'südlich';
				break;
			case Direction.SouthWest:
				part = 'südwestlich';
				break;
			case Direction.West:
				part = 'westlich';
				break;
			case Direction.NorthWest:
				part = 'nordwestlich';
				break;
		}

		let versions = [
			`${part} von dir`,
			`in ${part}er Richtung`,
			`in ${part}er Richtung von dir`,
			`von dir aus ${part}`,
		];

		switch (direction) {
			case Direction.NorthEast:
			case Direction.SouthEast:
			case Direction.SouthWest:
			case Direction.NorthWest:
				let cornerPhrase = ['Ecke', 'Richtung'][this.random(1)];
				versions.push(`in ${part}er ${cornerPhrase}`);
				versions.push(`in ${part}er ${cornerPhrase} von dir`);
				versions.push(`in ${part}er ${cornerPhrase} von dir aus`);
				versions.push(`in der ${part}en ${cornerPhrase}`);
				versions.push(`in der ${part}en ${cornerPhrase} von dir`);
				versions.push(`in der ${part}en ${cornerPhrase} von dir aus`);
		}

		return versions[this.random(versions.length - 1)];
	}

	randomHeightSentencePart(part: Height): string {
		let versions: string[] = [];

		if (part === Height.Middle || part === Height.null) {
			return '';
		} else if (part === Height.Top) {
			versions = [
				'über dir',
				'an der Decke',
				'oben',
			];
		} else if (part === Height.Bottom) {
			versions = [
				'unter dir',
				'zu deinen Füßen',
				'auf dem Boden',
				'unten',
			];
		}
		return versions[this.random(versions.length - 1)];
	}

	describeObjectLocation(location: Location | null = null): string {
		if (!location) {
			location = this.location;
		}
		if (location === null) {
			console.error('location is null');
			return '';
		}

		if (!this.descriptions['object']) {
			let directionPart = this.randomLocationSentencePart(location.direction);
			let heightPart = this.randomHeightSentencePart(location.height);

			this.descriptions['object'] = `${directionPart} ${heightPart}`.trim();
		}

		return this.descriptions['object'];
	}
}
