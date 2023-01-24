
import Action from ".";
import GameObject from "../GameObject";
import { lookupDirection } from "../Location/helpers";
import { Direction } from "../Location/types";
import Player from "../Player";
import { ActionType, ActionConfig, ActionParsed } from "./types";


const directionRegex = '(?:n[oö]rd|nord[oö]st|[oö]st|süd[oö]st|süd|südwest|west|nordwest)(?:lich(?:e[sn])?)?';
const singleWordRegex = '[\\wöäü]+';

export default class ActionParser {
	_blueprint: ActionConfig = null;

	constructor(blueprint: ActionConfig) {
		this._blueprint = blueprint;
	}

	actionRegexParser: { [key: string]: RegExp[] } = {
		[ActionType.Attack]: [
			new RegExp(`Greife (?:(?:den|das|die) )?(?:(?<targetDirection>${directionRegex}) )?(?<target>${singleWordRegex}) (?:mit (?:dem|meinem|einem)?(?<using>${singleWordRegex}) )?an`, 'i'),
		],
		[ActionType.PickUp]: [
			new RegExp(`Nimm (?:(?:den|das|die) )?(?<target>.+)`, 'i'),
		],
		[ActionType.Look]: [
			/Schau +(?<target>.+) an/i,
			/Untersuche +(?<target>.+)/i,
		],
		[ActionType.PutDown]: [
			new RegExp(`Lege (?:(?:den|das|die) )?(?<target>${singleWordRegex})(?: (?:(?:auf|in) (?:(?:den|die|dem|der) )?)(?:(?<targetDirection>${directionRegex}) )?(?<using>${singleWordRegex})(?: (?:ab))?| (?:(?<direction>${directionRegex}) )?(?:ab))`, 'i'),
		]
	}

	findMatch(action: string): ActionParsed {
		for (let type in this.actionRegexParser) {
			for (let regex of this.actionRegexParser[type]) {
				let match = regex.exec(action);
				console.log(regex);
				if (match) {
					match.groups.type = type;
					return match.groups;
				}
			}
		}
	}

	parse(action: string): Action {
		let match = this.findMatch(action);

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



