import IKitchen, { IIngredient } from "./Ikitchen";
import { DishType } from "../types";
import { Dish } from "./dish";

export default class Kitchen implements IKitchen {
	cookingTimeMul: number;
	nbCooker: number;
	usedCooker: number;
	restockDelay: number;
	ingredients: IIngredient;
	dishs: Dish[];

	constructor(cookingTimeMul: number, nbCooker: number, restockDelay: number) {
		this.cookingTimeMul = cookingTimeMul;
		this.nbCooker = nbCooker;
		this.restockDelay = restockDelay;

		this.dishs = [];
		this.usedCooker = 0;

		this.ingredients = {
			octopus: 5,
			soja: 5,
			rice: 5,
			pork: 5,
			eggs: 5,
			noodle: 5,
			chicken: 5,
			dough: 5,
			matcha: 5,
			chocolate: 5
		}

		setInterval(() => this.restock(), restockDelay);
	}

	addDish(dish: Dish): boolean {
		if (this.dishs.length >= this.nbCooker*2 - this.usedCooker) return false;

		switch (dish.type) {
			case DishType.Takoyaki:
				if (this.ingredients.octopus > 0 &&
					this.ingredients.soja > 0) {
					this.ingredients.octopus--;
					this.ingredients.soja--;

					this.dishs.push(dish);
					this.cook();
					return true;
				}
				return false;

			case DishType.Katsudon:
				if (this.ingredients.rice > 0 &&
					this.ingredients.pork > 0 &&
					this.ingredients.eggs > 0) {
					this.ingredients.rice--;
					this.ingredients.pork--;
					this.ingredients.eggs--;
					
					this.dishs.push(dish);
					this.cook();
					return true;
				}
				return false;

			case DishType.Udon:
				if (this.ingredients.noodle > 0 &&
					this.ingredients.pork > 0 &&
					this.ingredients.eggs > 0) {
					this.ingredients.noodle--;
					this.ingredients.pork--;
					this.ingredients.eggs--;

					this.dishs.push(dish);
					this.cook();
					return true;
				}
				return false;

			case DishType.Ramen:
				if (this.ingredients.noodle > 0 &&
					this.ingredients.chicken > 0 &&
					this.ingredients.eggs > 0) {
					this.ingredients.noodle--;
					this.ingredients.chicken--;
					this.ingredients.eggs--;

					this.dishs.push(dish);
					this.cook();
					return true;
				}
				return false;

			case DishType.MatchaCookie:
				if (this.ingredients.dough > 0 &&
					this.ingredients.matcha > 0 &&
					this.ingredients.chocolate > 0) {
					this.ingredients.dough--;
					this.ingredients.matcha--;
					this.ingredients.chocolate--;

					this.dishs.push(dish);
					this.cook();
					return true;
				}
				return false;

			default:
				return false;
		}
	}

	cook(): void {
		if (this.dishs.length == 0) return;

		if (this.nbCooker <= this.usedCooker) return;

		const dish = this.dishs.shift();

		this.usedCooker++
		dish.cook().then(() => {
			this.usedCooker--;
			this.cook();
		});
	}

	restock(): void {
		for (const ingredient in this.ingredients) {
			this.ingredients[ingredient] += 1;
		}
	}

	isActive(): boolean {
		return this.usedCooker > 0;
	}
}