import Action from "../Action";

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
}