import Action from "../Action";
import GenericItem from "../GenericItem";

export default interface GameObject {
	id: string;
	name: string;

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