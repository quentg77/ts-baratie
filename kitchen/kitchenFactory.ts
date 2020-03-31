import * as cluster from 'cluster';
import { Order } from "../types";
import { Dish } from "./dish";

// define worker exec file and exit if not master
if (cluster.isMaster) {
	cluster.setupMaster({
		exec: "worker.ts"
	});
} else {
	console.log("Need Master, not Worker");
	process.exit(-1);
}

export default class KitchenFactory {
	static instance: KitchenFactory;

	private kitchens: cluster.Worker[];
	private cookingTimeMul: number;
	private nbCooker: number;
	private restockDelay: number;
	private waitingDish: Dish[];
	private next: number;

	constructor(cookingTimeMul: number, nbCooker: number, restockDelay: number) {
		if (!!KitchenFactory.instance) {
			return KitchenFactory.instance;
		}

		//init
		this.cookingTimeMul = cookingTimeMul;
		this.nbCooker = nbCooker;
		this.restockDelay = restockDelay;
		this.kitchens = [];
		this.waitingDish = [];
		this.next = 0;

		KitchenFactory.instance = this;

		return this;
	}

	addOrders(orders: Order[]): void {
		this.waitingDish = this.waitingDish.concat(this.getDishs(orders));
		this.nextKitchen();
	}

	private addKitchen(): void {
		const kitchen = cluster.fork({
			cookingTimeMul: this.cookingTimeMul,
			nbCooker: this.nbCooker,
			restockDelay: this.restockDelay,
		});

		kitchen.on("online", () => {
			this.sendDishs();
		});

		kitchen.on('message', message => {
			switch (message.action) {
				case "OverFlow":
					if (!message.data) break;
					const { type, size, cookingTimeMul } = message.data;
					const dish: Dish = new Dish(parseInt(type), parseInt(size), parseInt(cookingTimeMul));
					this.waitingDish.push(dish);
					this.nextKitchen();
					break;

				default:
					break;
			}
		});

		kitchen.on("exit", () => {
			console.log(`worker [${kitchen.process.pid}] stop`);
			this.kitchens = this.kitchens.filter(kit => kit.process.pid != kitchen.process.pid);
			
			if (this.kitchens.length == 0) {
				console.log("All Orders are done");
				process.exit(0);
			}
		});

		this.kitchens.push(kitchen);
	}

	private nextKitchen(): void {
		if (this.next < this.kitchens.length) {
			const kitchen = this.kitchens.shift();
			this.kitchens.push(kitchen);
			this.next++;
			this.sendDishs();
		} else {
			this.next = 0;
			this.addKitchen();
		}
	}

	private sendDishs() {
		for (const kitchen of this.kitchens) {
			if (this.waitingDish.length > 0 && kitchen.isConnected()) {
				const { type, size, cookingTimeMul } = this.waitingDish.shift();
				kitchen.send({ type, size, cookingTimeMul });
			}
		}

		// recursivity
		if (this.waitingDish.length > 0) {
			this.sendDishs();
		}
	}

	private getDishs(orders: Order[]): Dish[] {
		let dishs = [];

		for (const order of orders) {
			for (let i = 0; i < order.number; i++) {
				dishs.push(new Dish(order.type, order.size, this.cookingTimeMul));
			}
		}

		return dishs;
	}
}