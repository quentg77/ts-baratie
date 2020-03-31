export enum DishType {
	Takoyaki,
	Katsudon,
	Udon,
	Ramen,
	MatchaCookie
}

export enum DishSize {
	S,
	M,
	L,
	XL,
	XXL
}

export interface Order {
	type: DishType;
	size: DishSize;
	number: number;
}