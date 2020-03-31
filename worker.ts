import * as cluster from 'cluster';

// exit if not worker
if (cluster.isMaster) {
	console.log("Need Worker, not Master");
	process.exit(-1);
}

console.log("Worker OK");

process.exit(0);