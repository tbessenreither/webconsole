export enum Direction {
	null = 'null',
	Center = 'Center',
	North = 'North',
	NorthEast = 'NorthEast',
	East = 'East',
	SouthEast = 'SouthEast',
	South = 'South',
	SouthWest = 'SouthWest',
	West = 'West',
	NorthWest = 'NorthWest',
}

export enum Height {
	null = 'null',
	Top = 'Top',
	Middle = 'Middle',
	Bottom = 'Bottom',
}

export type Location = {
	direction: Direction;
	height: Height;
}

export type LocationList = {
	[key: string]: Location;
}