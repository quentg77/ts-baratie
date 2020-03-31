import { DishType, DishSize } from "../types";

export class Dish {
	type: DishType;
	size: DishSize;
	cookingTimeMul: number;

	constructor(type: DishType, size: DishSize, cookingTimeMul: number) {
		this.type = type;
		this.size = size;
		this.cookingTimeMul = cookingTimeMul;
	}

	cook(): Promise<boolean> {
		let totalTime = this.cookingTimeMul;

		switch (this.type) {
			case DishType.Takoyaki:
				totalTime *= 1000;
				break;
			case DishType.Katsudon:
				totalTime *= 2000;
				break;
			case DishType.Udon:
				totalTime *= 2000;
				break;
			case DishType.Ramen:
				totalTime *= 2000;
				break;
			case DishType.MatchaCookie:
				totalTime *= 4000;
				break;
			default:
				break;
		}

		return new Promise<boolean>(resolve => {
			setTimeout(() => {
				console.log(`Cooked ${DishType[this.type]} size ${DishSize[this.size]}`);
				resolve(true);
			}, totalTime);
		});
	}
}