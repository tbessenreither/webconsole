import { getDirectionChangeInDegrees } from "./helpers";
import { Direction, RotationDirection } from "./types";

export default class Rotation {
	degrees: number;

	static getDirectionChange(directionReference: Direction, directionTarget: Direction): Rotation {
		let changeInDegrees = getDirectionChangeInDegrees(directionReference, directionTarget);
		return new Rotation(changeInDegrees);
	}

	constructor(degrees: number) {
		this.degrees = degrees;
	}

	get degree(): number {
		return this.degrees;
	}

	get degreeAbs(): number {
		return Math.abs(this.degrees);
	}

	get direction(): RotationDirection {
		if (this.degrees === 0) {
			return RotationDirection.null;
		} else if (this.degrees === 180 || this.degrees === -180) {
			return RotationDirection.uTurn;
		} else if (this.degrees > 0) {
			return RotationDirection.Right;
		} else if (this.degrees < 0) {
			return RotationDirection.Left;
		}
	}
}