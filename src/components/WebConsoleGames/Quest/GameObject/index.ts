import Action from "../Action";

export default interface GameObject {
	id: string;
	name: string;

	get isUsable(): boolean;

	toObject(): any;
	fromObject(object: any): GameObject;

	tick(): void;
	use(action: Action): void;
	describe(): string;
}