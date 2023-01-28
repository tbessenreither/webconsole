import Action from "../Action";
import { LocationDescriptor } from "../Descriptors/Location";
import GenericItem from "../GenericItem";
import { GameObjectList } from "./types";

export default interface GameObject {
	id: string;
	name: string;
	type?: string;
	keywords?: string[];
	isHidden?: boolean;
	hasInventory?: boolean;
	inventory?: GameObjectList
	location?: LocationDescriptor;

	get isUsable(): boolean;

	toObject(): any;
	fromObject(object: any): GameObject;

	tick(): void;
	describe(): string;
	use?(action: Action): void;
	markUsage?(action: Action): void;

	removeFromInventory?(item: GenericItem): void;
	addToInventory?(item: GenericItem): void;
	searchInventoryByName?(name: string): GenericItem | null
	pickUp?(action: Action): GenericItem | null

	read?(action: Action): void;
}