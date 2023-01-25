
import Action from "./";
import GameObject from "../GameObject";
import { lookupDirection } from "../Location/helpers";
import { Direction } from "../Location/types";
import Player from "../Player";
import { ActionType, ActionConfig, ActionParsed } from "./types";
import GenericItem from "../GenericItem";


const directionRegex = '(?:n[oö]rd|nord[oö]st|[oö]st|süd[oö]st|süd|südwest|west|nordwest)(?:lich(?:e[sn]?)?)?';
const singleWordRegex = '[\\wöäüß]+';

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
		[ActionType.Look]: [
			new RegExp(`^Untersuche(?: das Zimmer| den Raum| die Umgebung)$`, 'i'),
			new RegExp(`Schau (?:(?:den|die|das) )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex}) an`, 'i'),
			new RegExp(`Untersuche (?:(?:den|die|das) )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex})`, 'i'),
		],
		[ActionType.Attack]: [
			new RegExp(`Greife (?:(?:den|das|die) )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex}) (?:mit (?:dem|meinem|einem)?(?<using>${singleWordRegex}) )?an`, 'i'),
		],
		[ActionType.PickUp]: [
			new RegExp(`(?:Nimm|Hebe) (?:(?:den|die|das) )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex})`, 'i'),
		],
		[ActionType.PutDown]: [
			new RegExp(`Lege (?:(?:den|das|die) )?(?<target>${singleWordRegex})(?: (?:(?:auf|in) (?:(?:den|die|dem|der) )?)(?:(?<targetDirection>${directionRegex}) )?(?<using>${singleWordRegex})(?: (?:ab))?| (?:(?<direction>${directionRegex}) )?(?:ab))`, 'i'),
		],
		[ActionType.Open]: [
			new RegExp(`Öffne (?:(?:den|die|das) )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex})`, 'i'),
		],
		[ActionType.Close]: [
			new RegExp(`^Schließe (?:(?:den|die|das) )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex})$`, 'i'), // ^ und $ sind hier wichtig, da sonst ActionType.Lock und ActionType.Unlock auch als ActionType.Close erkannt wird
		],
		[ActionType.Lock]: [
			new RegExp(`(?:Schließe|Sperre) (?:(?:den|die|das) )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex}) (?:ab|zu)`, 'i'),
		],
		[ActionType.Unlock]: [
			new RegExp(`(?:Schließe|Sperre) (?:(?:den|die|das) )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex}) (?:auf)`, 'i'),
		],
		[ActionType.Exit]: [
			new RegExp(`(?:Gehe|Verlasse den Raum) durch (?:(?:den|die|das) )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex})`, 'i'),
		],
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

		let directionObj: Direction = null;
		if (match.direction) {
			directionObj = lookupDirection(match.direction);
		}

		let targetDirectionObj: Direction = null;
		if (match.targetDirection) {
			targetDirectionObj = lookupDirection(match.targetDirection);
		}

		let targetObj: GameObject = null;
		if (match.type === ActionType.PutDown) {
			if (match.target) {
				let player = this._blueprint.origin as Player;
				let target = player.searchInventoryByName(match.target);

				if (target) {
					targetObj = target;
				}
			}
		} else if (match.type === ActionType.Open) {
			if (match.target) {
				let player = this._blueprint.origin as Player;
				let target: GameObject | GenericItem = player.searchInventoryByName(match.target);

				if (target) {
					targetObj = target;
				}

				target = this._blueprint.room.lookupGameObjectByName(match.target, targetDirectionObj);
				if (target) {
					targetObj = target;
				}
			}
		} else {
			if (match.target) {
				let target = this._blueprint.room.lookupGameObjectByName(match.target, targetDirectionObj);
				if (target) {
					targetObj = target;
				}
			}
		}

		let usingObj: GameObject = null;
		if (match.using) {
			let using = this._blueprint.room.lookupGameObjectByName(match.using, targetDirectionObj);
			if (using) {
				usingObj = using;
			}
		}

		let actionConfig = {
			type: match.type,
			origin: this._blueprint.origin,
			targets: targetObj ? [targetObj] : [],
			using: usingObj ? [usingObj] : [],
			room: this._blueprint.room,
			direction: directionObj ? directionObj : Direction.Center,
			parsedData: match
		};

		return new Action(actionConfig);
	}
}



