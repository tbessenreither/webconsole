import Rotation from './Rotation';
import { Direction, RotationDirection } from './types';

export function lookupDirection(directionString: string): Direction {
	let direction = Direction.null;

	switch (directionString) {
		case 'nördliche':
		case 'nördlichen':
		case 'nordöstliches':
		case 'nördlich':
		case 'norden':
		case 'nord':
		case 'n':
		case 'northern':
		case 'north':
			direction = Direction.North;
			break;
		case 'nordöstliche':
		case 'nordöstlichen':
		case 'nordöstliches':
		case 'nordöstlich':
		case 'nordosten':
		case 'nordost':
		case 'no':
		case 'northeastern':
		case 'northeast':
		case 'ne':
			direction = Direction.NorthEast;
			break;
		case 'östliche':
		case 'östlichen':
		case 'östliches':
		case 'östlich':
		case 'osten':
		case 'ost':
		case 'o':
		case 'eastern':
		case 'east':
		case 'e':
			direction = Direction.East;
			break;
		case 'südöstliche':
		case 'südöstlichen':
		case 'südöstliches':
		case 'südöstlich':
		case 'südosten':
		case 'südost':
		case 'so':
		case 'sö':
		case 'southeastern':
		case 'southeast':
		case 'se':
			direction = Direction.SouthEast;
			break;
		case 'südliche':
		case 'südlichen':
		case 'südliches':
		case 'südlich':
		case 'süden':
		case 'süd':
		case 's':
		case 'southern':
		case 'south':
			direction = Direction.South;
			break;
		case 'südwestliche':
		case 'südwestlichen':
		case 'südwestliches':
		case 'südwestlich':
		case 'südwesten':
		case 'südwest':
		case 'sw':
		case 'southernwestern':
		case 'southwestern':
		case 'southwest':
			direction = Direction.SouthWest;
			break;
		case 'westliche':
		case 'westlichen':
		case 'westliches':
		case 'westlich':
		case 'westen':
		case 'west':
		case 'w':
		case 'western':
		case 'west':
			direction = Direction.West;
			break;
		case 'nordwestliche':
		case 'nordwestlichen':
		case 'nordwestliches':
		case 'nordwestlich':
		case 'nordwesten':
		case 'nordwest':
		case 'nw':
		case 'northernwestern':
		case 'northwestern':
		case 'northwest':
			direction = Direction.NorthWest;
			break;
	}
	return direction;
}

export function inverseDirection(direction: Direction): Direction {
	let inverseDirection = Direction.null;

	switch (direction) {
		case Direction.North:
			inverseDirection = Direction.South;
			break;
		case Direction.NorthEast:
			inverseDirection = Direction.SouthWest;
			break;
		case Direction.East:
			inverseDirection = Direction.West;
			break;
		case Direction.SouthEast:
			inverseDirection = Direction.NorthWest;
			break;
		case Direction.South:
			inverseDirection = Direction.North;
			break;
		case Direction.SouthWest:
			inverseDirection = Direction.NorthEast;
			break;
		case Direction.West:
			inverseDirection = Direction.East;
			break;
		case Direction.NorthWest:
			inverseDirection = Direction.SouthEast;
			break;
	}

	return inverseDirection;
}

export function directionToStringIs(direction: Direction): string {
	let directionString = '';

	switch (direction) {
		case Direction.North:
			directionString = 'nördlich';
			break;
		case Direction.NorthEast:
			directionString = 'nordöstlich';
			break;
		case Direction.East:
			directionString = 'östlich';
			break;
		case Direction.SouthEast:
			directionString = 'südöstlich';
			break;
		case Direction.South:
			directionString = 'südlich';
			break;
		case Direction.SouthWest:
			directionString = 'südwestlich';
			break;
		case Direction.West:
			directionString = 'westlich';
			break;
		case Direction.NorthWest:
			directionString = 'nordwestlich';
			break;
	}

	return directionString;
}

export function directionToStringTo(direction: Direction): string {
	let directionString = '';

	switch (direction) {
		case Direction.North:
			directionString = 'norden';
			break;
		case Direction.NorthEast:
			directionString = 'nordosten';
			break;
		case Direction.East:
			directionString = 'osten';
			break;
		case Direction.SouthEast:
			directionString = 'südosten';
			break;
		case Direction.South:
			directionString = 'süden';
			break;
		case Direction.SouthWest:
			directionString = 'südwesten';
			break;
		case Direction.West:
			directionString = 'westen';
			break;
		case Direction.NorthWest:
			directionString = 'nordwesten';
			break;
	}

	return directionString;
}

export function mapDirectionToDegree(direction: Direction): number {
	switch (direction) {
		case Direction.North:
			return 0;
		case Direction.NorthEast:
			return 45;
		case Direction.East:
			return 90;
		case Direction.SouthEast:
			return 135;
		case Direction.South:
			return 180;
		case Direction.SouthWest:
			return 225;
		case Direction.West:
			return 270;
		case Direction.NorthWest:
			return 315;
		default:
			return 0;
	}
}

export function getDirectionChangeInDegrees(directionReference: Direction, directionTarget: Direction): number {
	// with 8 directions on a compass
	// get change in rotation in degree between directionRefference and directionTarget

	if (directionReference === directionTarget) {
		return 0;
	}

	let directionReferenceDegree = mapDirectionToDegree(directionReference);
	let directionTargetDegree = mapDirectionToDegree(directionTarget);

	let directionChangeDegree = directionTargetDegree - directionReferenceDegree;

	if (directionChangeDegree > 180) {
		directionChangeDegree = directionChangeDegree - 360;
	} else if (directionChangeDegree < -180) {
		directionChangeDegree = directionChangeDegree + 360;
	}

	return directionChangeDegree;
}

export function describeDirectionChange(directionReference: Direction, directionOut: Direction): string {
	let rotation = Rotation.getDirectionChange(directionReference, directionOut);

	let directionChangeString = '';

	switch (rotation.direction) {
		case RotationDirection.Left:
			directionChangeString = `${rotation.degreeAbs}° nach links`;
			break;
		case RotationDirection.Right:
			directionChangeString = `${rotation.degreeAbs}° nach rechts`;
			break;
		case RotationDirection.null:
			directionChangeString = 'geradeaus';
			break;
		case RotationDirection.uTurn:
			directionChangeString = 'in einer 180° Wende in die entgegengesetzte Richtung';
			break;
	}

	return directionChangeString;
}