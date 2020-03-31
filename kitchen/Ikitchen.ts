import { Dish } from "./dish";

export default interface IKitchen {
	cookingTimeMul: number;
	nbCooker: number;
	usedCooker: number;
	restockDelay: number;
	ingredients: IIngredient;
	dishs: Dish[];

	restock(): void;
	cook(): void;
	addDish(dish: Dish): boolean;
}

export interface IIngredient {
	octopus: number;
	soja: number;
	rice: number;
	pork: number;
	eggs: number;
	noodle: number;
	chicken: number;
	dough: number;
	matcha: number;
	chocolate: number;
}