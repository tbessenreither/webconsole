
export default interface GameObject {
	toObject(): any;
	fromObject(object: any): GameObject;

	tick(): void;
}