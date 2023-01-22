export enum Direction {
	null,
	Center,
	North,
	NorthEast,
	East,
	SouthEast,
	South,
	SouthWest,
	West,
	NorthWest,
}

export enum Height {
	null,
	Top,
	Middle,
	Bottom,
}

export type Location = {
	direction: Direction;
	height: Height;
}

export type LocationList = {
	[key: string]: Location;
}