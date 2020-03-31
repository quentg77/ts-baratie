import * as cluster from 'cluster';
import * as readline from 'readline';
import { Order, DishType, DishSize } from './types';

// define worker exec file and exit if not master
if (cluster.isMaster) {
	cluster.setupMaster({
		exec: "worker.ts"
	});
} else {
	console.log("Need Master, not Worker");
	process.exit(-1);
}

class Reception {
	static instance: Reception;

	private kitchen: number;

	constructor() {
		if (!!Reception.instance) {
			return Reception.instance;
		}

		this.kitchen = 1;

		Reception.instance = this;

		return this;
	}

	getKitchen() {
		return this.kitchen;
	}

	addKitchen() {
		this.kitchen++;
	}
}

// main code
const cookingTime: number = Number(process.argv[2]);
const nbCooker: number = Number(process.argv[3]);
const restockDelay: number = Number(process.argv[4]);

if (isNaN(cookingTime) || isNaN(nbCooker) || isNaN(restockDelay)) {
	console.log("Bad arguments, need only int value");
	console.log("Ex: yarn start 2 5 2000");
	process.exit(-1);
}

console.log(cookingTime, nbCooker, restockDelay);

const input = askInput("your order : ").then((input): Order[] | boolean | void => {
	const orderInputList = input.split(/; /);
	
	let invalidOrder = false;

	const orders = orderInputList.map(rawOrder => {
		const reg = new RegExp(getInputRegex());
		const parsedOrder = rawOrder.match(reg);

		if (!parsedOrder) {
			invalidOrder = true;
		}

		const [,type,size,number] = parsedOrder;

		const order: Order = {
			type: DishType[type],
			size: DishSize[size],
			number: parseInt(number)
		};

		return order;
	});

	console.log(orders);
});


function askInput(question: string): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	return new Promise<string>(resolve =>
		rl.question(question, res => {
			rl.close();
			resolve(res);
		})
	);
}

function getInputRegex(): string {
	const dishType = Object.keys(DishType).filter(k => typeof DishType[k as any] === "number").join("|");
	const dishSize = Object.keys(DishSize).filter(k => typeof DishSize[k as any] === "number").join("|");
	return `^(${dishType})\\s(${dishSize})\\sx([1-9][0-9]*)$`;
}