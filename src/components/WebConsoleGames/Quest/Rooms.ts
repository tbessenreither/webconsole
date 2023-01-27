import { RoomList } from "./GenericRoom/types";
import { ExitType, ExitList } from "./GenericExit/types";
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
				weight: 20,
				location: { direction: Direction.East, height: Height.null },
				hasInventory: true,
				inventory: [
					{
						id: 'KerkerTischBriefAnUnbekannten',
						name: 'Brief',
						location: { direction: Direction.null, height: Height.null },
						keywords: ['zettel', 'brief', 'brief an unbekannten'],
						type: ItemType.Letter,
						description: 'Die Schrift ist schon stark verblichen aber gerade noch lesbar',
						weight: 0.005,
						meta: {
							text: 'Hallo, du kennst mich nicht aber ich kenne dich. Ich habe dich beobachtet und ich weiß, dass du hier bist. Ich weiß auch, dass du hier raus willst. Ich kann dir helfen. Ich habe einen Schlüssel, der dich hier raus bringt. Ich werde ihn dir geben, aber du schuldest mir was. Dein Freund, der Unbekannte',
							messageOnPickup: 'Er ist schwerer als du dachtest.',
							nameAfterReading: 'Brief von unbekanntem (gelesen)',
							attached: [
								{
									id: 'KerkerSchlüssel',
									name: 'kleiner rostiger Schlüssel',
									keywords: ['schlüssel', 'kleinen schlüssel', 'kleinen rostigen schlüssel', 'rostigen schlüssel', 'rostigen kleinen schlüssel'],
									type: ItemType.Key,
									description: 'er ist klein und rostig',
									weight: 0.05,
									uses: 1,
									location: { direction: Direction.West, height: Height.Bottom },
								},
							],
						},
					},
				],
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
		description: 'sie ist sehr alt und aus Holz',
		closed: true,
		locked: true,
		unlockItemKey: 'KerkerSchlüssel',
	},
	{
		id: 'hallway-kerkerVorraum-kerkervorraum2',
		rooms: ['KerkerVorraum', 'KerkerVorraum2'],
		unusableFrom: [],
		type: ExitType.Hallway,
		locations: {},
		description: '',
		closed: false,
		locked: true,
	},
	{
		id: 'hallway-kerkervorraum2-kerker',
		rooms: ['KerkerVorraum2', 'Kerker'],
		unusableFrom: [],
		type: ExitType.Hallway,
		locations: {},
		description: 'er ist dunkel und du kannst das Ende nicht erkennen',
		closed: false,
		locked: true,
	},
];

export default {
	rooms,
	exits,
};