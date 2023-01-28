import { RoomList } from "./GenericRoom/types";
import { ExitType, ExitList } from "./GenericExit/types";
import { Direction, Height } from "./Location/types";
import { ItemType } from "./GenericItem/types";

let rooms: RoomList = [
	{
		startingRoom: true,
		id: 'homeLivingRoom',
		name: 'Wohnzimmer',
		description: 'Du bist in deinem Wohnzimmer. Es ist sehr hell und gemütlich',
		items: [
			{
				id: 'homeLivingRoomTable',
				name: 'Tisch',
				keywords: ['tisch', 'glastisch', 'glasplatte', 'holztisch'],
				description: 'er ist aus Holz und hat eine Glasplatte. Du hast es vor ein paar Jahren von deiner Oma geerbt',
				type: ItemType.Table,
				weight: 50,
				location: { direction: Direction.Center, height: Height.Bottom },
			},
			{
				id: 'homeLivingRoomCouch',
				name: 'Couch',
				keywords: ['Couch', 'Sofa'],
				description: 'sie ist aus Leder und sehr bequem',
				type: ItemType.Couch,
				weight: 100,
				location: { direction: Direction.North, height: Height.null },
			},
			{
				id: 'homeLivingRoomTvSet',
				name: 'TV-Schrank',
				keywords: ['Couch', 'Sofa'],
				description: 'er ist von Ikea. Du hast ihn gekauft als du noch alleine gewohnt hast',
				type: ItemType.Shelf,
				weight: 200,
				location: { direction: Direction.South, height: Height.null },
			},
			{
				id: 'homeLivingRoomTv',
				name: 'TV',
				keywords: ['Fernseher', 'TV'],
				description: 'ein Plasma-Fernseher. Nicht deine beste Investition',
				type: ItemType.Tv,
				weight: 40,
				location: { direction: Direction.South, height: Height.Middle },
			},
		],
		monsters: [],
		exits: [
			{
				id: 'door-home-livingroom-kitchen',
				location: { direction: Direction.West, height: Height.null },
			},
		],
	},
	{
		id: 'homeLivingKitchen',
		name: 'Küche',
		description: 'Du stehst in der Küche. Sie ist relativ neu. Du und deine Frau haben sie vor ein paar Jahren renoviert.',
		items: [
		],
		monsters: [],
		exits: [
			{
				id: 'door-home-livingroom-kitchen',
				location: { direction: Direction.West, height: Height.null },
			},
		],
	},
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
							nameAfterReading: 'Brief von unbekanntem (gelesen)',
							roomActionsAfterReading: [
								'unhide door-kerker-kerkervorraum',
							],
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
						messageEvents: {
							onPickUp: {
								message: 'Er ist schwerer als du dachtest.',
								playTimes: 1,
								timesPlayed: 0,
							},
							afterPickUp: 'Du spürst einen kalten luftzug, als du den Brief aufhebst.',
							afterReading: {
								message: 'Als du den Brief zuende gelesen hast hörst du ein kratzendes Geräusch. Du blickst in die Richtung und vor dir erscheint eine Tür.',
								playTimes: 1,
								timesPlayed: 0,
							},
						}
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
		id: 'door-home-livingroom-kitchen',
		unusableFrom: [],
		type: ExitType.Door,
		locations: {},
		description: 'am Türrahmen sind Markierungen mit Jahreszahlen',
		closed: false,
		locked: false,
		unlockItemKey: 'key-door-home-livingroom-kitchen',
	},
	{
		id: 'door-kerker-kerkervorraum',
		rooms: ['Kerker', 'KerkerVorraum'],
		unusableFrom: [],
		type: ExitType.Door,
		isHidden: true,
		locations: {},
		description: 'sie ist sehr alt und aus Holz',
		closed: true,
		locked: true,
		unlockItemKey: 'KerkerSchlüssel',
	},
	{
		id: 'hallway-kerkerVorraum-kerkervorraum2',
		unusableFrom: [],
		type: ExitType.Hallway,
		locations: {},
		description: '',
		closed: false,
		locked: true,
	},
	{
		id: 'hallway-kerkervorraum2-kerker',
		rooms: ['Kerker'],
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