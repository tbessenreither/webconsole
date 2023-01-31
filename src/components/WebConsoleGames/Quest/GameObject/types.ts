import GameObject from ".";
import { PrintConfig } from "../Print/types";

export type GameObjectList = { [id: string]: GameObject };

export type ObjectMetaTypes = string | string[] | number | number[] | null | boolean | PrintConfig;
export type ObjectMeta = { [key: string]: ObjectMetaTypes };
