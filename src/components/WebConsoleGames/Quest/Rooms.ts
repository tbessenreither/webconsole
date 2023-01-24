import { RoomList } from "./GenericRoom/types";
import { ExitType, ExitList } from "./Exits/types";
import { Direction, Height } from "./Location/types";
import { ItemType } from "./GenericItem/types";

let rooms: RoomList = [
	{
		id: 'Kerker',
		name: 'Kerker',
		description: 'Du stehst in einem dunklen Kerker. Es ist sehr kalt und du kannst kaum etwas erkennen.',
		items: [
			{
				id: 'KerkerTisch',
				name: 'Alter wackeliger Tisch',
				keywords: ['tisch', 'holztisch', 'alter tisch', 'alter holztisch', 'wackeliger tisch', 'alter wackeliger tisch'],
				type: ItemType.Table,
				description: 'Er ist aus Holz, alt und wackelt etwas',
				value: 0,
				weight: 20,
				uses: null,
				equippable: false,
				equipped: false,
				location: { direction: Direction.East, height: Height.null },
			},
			{
				id: 'KerkerSchlüssel',
				name: 'kleiner rostiger Schlüssel',
				keywords: ['schlüssel', 'kleinen schlüssel', 'kleinen rostigen schlüssel', 'rostigen schlüssel', 'rostigen kleinen schlüssel'],
				type: ItemType.Key,
				description: 'er ist klein und rostig',
				value: 0,
				weight: 0.05,
				uses: 1,
				equippable: false,
				equipped: false,
				location: { direction: Direction.West, height: Height.Bottom },
			},
		],
		monsters: [],
		exits: [
			{
				id: 'door-kerker-kerkervorraum',
				location: { direction: Direction.North, height: Height.null },
			},
		],
	},
	{
		id: 'KerkerVorraum',
		name: 'Kerker Vorraum',
		description: 'Du stehst in einem Flur. Scheinbar ist das hier ein Kerker',
		items: [],
		monsters: [],
		exits: [
			{
				id: 'door-kerker-kerkervorraum',
				location: { direction: Direction.South, height: Height.null },
			},
			{
				id: 'hallway-kerkerVorraum-kerkervorraum2',
				location: { direction: Direction.East, height: Height.null },
			},
		],
	},
	{
		id: 'KerkerVorraum2',
		name: 'Kerker Vorraum',
		description: 'Du stehst in einem weiteren Flur.',
		items: [],
		monsters: [],
		exits: [
			{
				id: 'hallway-kerkerVorraum-kerkervorraum2',
				location: { direction: Direction.South, height: Height.null },
			},
			{
				id: 'hallway-kerkervorraum2-kerker',
				location: { direction: Direction.North, height: Height.null },
				transitionMessage: 'Als du weiter ins dunkle gehst öffnet sich der Boden unter dir und du landest wieder im Kerker. Verwirrt stehst du auf und klopfst den Staub von deinen Klamotten',
			},
		],
	}
];

let exits: ExitList = [
	{
		id: 'door-kerker-kerkervorraum',
		rooms: ['Kerker', 'KerkerVorraum'],
		unusableFrom: [],
		type: ExitType.Door,
		locations: {},
		description: 'Sie ist sehr alt und aus Holz',
		closed: false,
		locked: true,
		unlockItemKey: 'KerkerSchlüssel',
	},
	{
		id: 'hallway-kerkerVorraum-kerkervorraum2',
		rooms: ['KerkerVorraum', 'KerkerVorraum2'],
		unusableFrom: [],
		type: ExitType.Hallway,
		locations: {},
		description: 'Er knickt um 90° ab',
		closed: false,
		locked: true,
	},
	{
		id: 'hallway-kerkervorraum2-kerker',
		rooms: ['KerkerVorraum2', 'Kerker'],
		unusableFrom: [],
		type: ExitType.Hallway,
		locations: {},
		description: 'Ein dunkler gerader Gang',
		closed: false,
		locked: true,
	},
];

export default {
	rooms,
	exits,
};