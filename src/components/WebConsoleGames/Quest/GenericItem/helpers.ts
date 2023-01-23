import GameObject from "../GameObject";
import { ItemList, ItemObjectList } from "./types";


export function ItemObjectListToGameObjectArray(itemObjectList: ItemObjectList): GameObject[] {
	return Object.values(itemObjectList);
}
