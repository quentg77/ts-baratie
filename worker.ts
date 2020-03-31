import * as cluster from 'cluster';
import Kitchen from './kitchen/kitchen';
import { Dish } from './kitchen/dish';

// exit if not worker
if (cluster.isMaster) {
	console.log("Need Worker, not Master");
	process.exit(-1);
}

console.log(`Worker [${process.pid}] started`);

const { cookingTimeMul, nbCooker, restockDelay } = process.env;
const kitchen = new Kitchen(
	parseInt(cookingTimeMul),
	parseInt(nbCooker),
	parseInt(restockDelay)
);
let lastActivity = Date.now();

process.on("message", message => {
	const { type, size, cookingTimeMul } = message;

	const dish: Dish = new Dish(parseInt(type), parseInt(size), parseInt(cookingTimeMul));

	const res = kitchen.addDish(dish);

	if (!res) {
		process.send({
			action: "OverFlow",
			data: {
				type,
				size,
				cookingTimeMul
			}
		});
	}
})

// delete worker if no activity
setInterval(() => {
	const now = Date.now();
	if (kitchen.isActive()) lastActivity = Date.now();
	if (now - lastActivity >= 5000) process.exit(0);
}, 100)

// security
setTimeout(() => {
	process.exit(0);
}, 60000);