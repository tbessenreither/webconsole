import GenericMonster from ".";
import { Location } from "../Location/types";
import { ItemConfig } from "../GenericItem/types";


export type MonsterId = string;


export enum MonsterType {
	Monster = 'Monster',
}

export type MonsterConfig = {
	id: MonsterId;
	name: string;
	keywords: string[];
	location: Location;
	health: number;
	maxHealth: number;
	strength: number;
	defense: number;
	loot: ItemConfig[];
}

export type MonsterList = MonsterConfig[];

export type MonsterObjectList = {
	[key: MonsterId]: GenericMonster;
}