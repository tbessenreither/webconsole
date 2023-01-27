
import Action from "./";
import GameObject from "../GameObject";
import { lookupDirection } from "../Location/helpers";
import { Direction } from "../Location/types";
import Player from "../Player";
import { ActionType, ActionConfig, ActionParsed, LookupIn } from "./types";
import GenericItem from "../GenericItem";


const directionRegex = '(?:n[oö]rd|nord[oö]st|[oö]st|süd[oö]st|süd|südwest|west|nordwest)(?:lich(?:e[sn]?)?)?';
const singleWordRegex = '[\\wöäüß]+';
const articlesRegex = '(?:den|die|das|der|dem|des|ein|eine|einen|einem|eines)';

export default class ActionParser {
	_blueprint: ActionConfig = null;

	constructor(blueprint: ActionConfig) {
		this._blueprint = blueprint;


		let sentences = [
			'Gehe durch die nördliche Tür',
			'Verlasse den Raum durch die nördliche Tür',
			'Gehe durch den östlichen Gang',
		];

		/*
		let results: { [key: string]: Action } = {};
		for (let sentence of sentences) {
			let result = this.parse(sentence);
			results[sentence] = result;
		}
		console.log(results);
		/** */
	}

	actionRegexParser: { [key: string]: RegExp[] } = {
		[ActionType.Investigate]: [
			new RegExp(`^Untersuche(?: (?:das )?Zimmer| (?:den )?Raum| (?:die )?Umgebung)$`, 'i'),
			new RegExp(`Schau (?:${articlesRegex} )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex}) an`, 'i'),
			new RegExp(`Untersuche (?:${articlesRegex} )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex})`, 'i'),
		],
		[ActionType.Attack]: [
			new RegExp(`Greife (?:${articlesRegex} )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex}) (?:mit (?:dem|meinem|einem)?(?<using>${singleWordRegex}) )?an`, 'i'),
		],
		[ActionType.PickUp]: [
			new RegExp(`(?:Nimm|Hebe) (?:${articlesRegex} )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex})`, 'i'),
		],
		[ActionType.PutDown]: [
			new RegExp(`Lege (?:${articlesRegex} )?(?<target>${singleWordRegex})(?: (?:(?:auf|in) (?:(?:den|die|dem|der) )?)(?:(?<targetDirection>${directionRegex}) )?(?<using>${singleWordRegex})(?: (?:ab))?| (?:(?<direction>${directionRegex}) )?(?:ab))`, 'i'),
		],
		[ActionType.Open]: [
			new RegExp(`Öffne (?:${articlesRegex} )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex})`, 'i'),
		],
		[ActionType.Close]: [
			new RegExp(`^Schließe (?:${articlesRegex} )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex})$`, 'i'), // ^ und $ sind hier wichtig, da sonst ActionType.Lock und ActionType.Unlock auch als ActionType.Close erkannt wird
		],
		[ActionType.Lock]: [
			new RegExp(`(?:Schließe|Sperre) (?:${articlesRegex} )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex}) (?:ab|zu)`, 'i'),
		],
		[ActionType.Unlock]: [
			new RegExp(`(?:Schließe|Sperre) (?:${articlesRegex} )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex}) (?:auf)`, 'i'),
		],
		[ActionType.Exit]: [
			new RegExp(`(?:Gehe|Verlasse den Raum) durch (?:${articlesRegex} )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex})`, 'i'),
		],
		[ActionType.Use]: [
			new RegExp(`(?:Benutze|Kombiniere) (?:${articlesRegex} )?(?<using>${singleWordRegex}) mit (?:${articlesRegex} )?(?<target>${singleWordRegex})`, 'i'),
		],
		[ActionType.Read]: [
			new RegExp(`(?:Lese) (?:${articlesRegex} )?(?<target>${singleWordRegex})`, 'i'),
		]
	}

	findMatch(action: string): ActionParsed {
		action = action.trim();
		for (let type in this.actionRegexParser) {
			for (let regex of this.actionRegexParser[type]) {
				let match = regex.exec(action);
				if (match) {
					console.log(regex);
					if (match.groups === undefined) {
						match.groups = {
							type: null,
							direction: null,
							targetDirection: null,
							target: null,
							using: null,
						};
					}
					match.groups.type = type;
					return match.groups;
				}
			}
		}
		return null;
	}

	parse(action: string): Action {
		let match = this.findMatch(action);
		console.log(action, match);
		if (!match) {
			return null;
		}

		let targetDirectionObj: Direction = null;
		if (match.targetDirection) {
			targetDirectionObj = lookupDirection(match.targetDirection);
		}

		let directionObj: Direction = null;
		if (match.direction) {
			directionObj = lookupDirection(match.direction);
		}

		let targetObj: GameObject = null;
		if (match.target) {
			switch (match.type) {
				case ActionType.PutDown:
					targetObj = this.lookupGameObjectsIn(match.target, targetDirectionObj, [LookupIn.Inventory]);
					break;
				case ActionType.Open:
				case ActionType.Use:
				case ActionType.Read:
					targetObj = this.lookupGameObjectsIn(match.target, targetDirectionObj, [LookupIn.Inventory, LookupIn.CurrentRoom]);
					break;
				case ActionType.PickUp:
				default:
					targetObj = this.lookupGameObjectsIn(match.target, targetDirectionObj, [LookupIn.CurrentRoom]);
			}
		}

		let usingObj: GameObject = null;
		if (match.using) {
			switch (match.type) {
				case ActionType.Use:
					usingObj = this.lookupGameObjectsIn(match.using, targetDirectionObj, [LookupIn.Inventory, LookupIn.CurrentRoom]);
					break;
				default:
					usingObj = this.lookupGameObjectsIn(match.using, targetDirectionObj, [LookupIn.CurrentRoom]);
			}
		}

		let actionConfig = {
			type: match.type,
			origin: this._blueprint.origin,
			targets: targetObj ? [targetObj] : [],
			using: usingObj ? [usingObj] : [],
			room: this._blueprint.room,
			targetDirection: targetDirectionObj ? targetDirectionObj : Direction.Center,
			direction: directionObj ? directionObj : Direction.Center,
			parsedData: match,
		};

		return new Action(actionConfig);
	}

	lookupGameObjectsIn(phrase: string, direction: Direction = null, targets: string[] = [LookupIn.Inventory, LookupIn.CurrentRoom]): GameObject {
		let item: GameObject = null;

		for (let target of targets) {
			if (target === LookupIn.Inventory) {
				let player = this._blueprint.origin as Player;
				item = player.searchInventoryByName(phrase);
			} else if (target === LookupIn.CurrentRoom) {
				item = this._blueprint.room.lookupGameObjectByName(phrase, direction);
			}
			if (item) {
				return item;
			}
		}

		return null;
	}
}



