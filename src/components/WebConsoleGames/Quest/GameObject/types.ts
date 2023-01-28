import GameObject from ".";

export type GameObjectList = { [id: string]: GameObject };

export type ObjectMetaTypes = string | number | null | boolean;
export type ObjectMeta = { [key: string]: ObjectMetaTypes };