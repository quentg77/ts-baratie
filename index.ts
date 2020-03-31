import * as cluster from 'cluster';
import * as readline from 'readline';
import { Order, DishType, DishSize } from './types';
import KitchenFactory from './kitchen/kitchenFactory';

// define worker exec file and exit if not master
if (cluster.isWorker) {
	console.log("Need Master, not Worker");
	process.exit(-1);
}

// main code
const cookingTimeMul: number = Number(process.argv[2]);
const nbCooker: number = Number(process.argv[3]);
const restockDelay: number = Number(process.argv[4]);

if (isNaN(cookingTimeMul) || isNaN(nbCooker) || isNaN(restockDelay)) {
	console.log("Bad arguments, need only int value");
	console.log("Ex: yarn start 2 5 2000");
	process.exit(-1);
}

const kitchenFactory = new KitchenFactory(cookingTimeMul, nbCooker, restockDelay)

const inputOrders = askInput("your order : ").then((input): Order[] | boolean => {
	const orderInputList = input.split(/; /);
	
	let invalidOrder = false;

	const orders = orderInputList.map(rawOrder => {
		const reg = new RegExp(getInputRegex());
		const parsedOrder = rawOrder.match(reg);

		if (!parsedOrder) {
			invalidOrder = true;
			return null;
		}

		const [,type,size,number] = parsedOrder;

		const order: Order = {
			type: DishType[type],
			size: DishSize[size],
			number: parseInt(number)
		};

		return order;
	});

	if (invalidOrder) return false;
	kitchenFactory.addOrders(orders);
	return orders;
});

function askInput(question: string): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	return new Promise<string>(resolve =>
		rl.question(question, res => {
			rl.close();
			res = res ? res : "toto";
			resolve(res);
		})
	);
}

function getInputRegex(): string {
	const dishType = Object.keys(DishType).filter(k => typeof DishType[k as any] === "number").join("|");
	const dishSize = Object.keys(DishSize).filter(k => typeof DishSize[k as any] === "number").join("|");
	return `^(${dishType})\\s(${dishSize})\\sx([1-9][0-9]*)$`;
}