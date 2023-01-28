import GameObject from ".";

export type GameObjectList = { [id: string]: GameObject };

export type ObjectMetaTypes = string | string[] | number | number[] | null | boolean;
export type ObjectMeta = { [key: string]: ObjectMetaTypes };

export type MessageEventConfig = {
	message: string;
	playTimes?: number;
	timesPlayed?: number;
}

export type MessageEventList = { [key: string]: MessageEventConfig | string };