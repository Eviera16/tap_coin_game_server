const { Worker } = require('worker_threads');
const cluster = require('cluster');

const thread1 = new Worker('./test_game_server_logic.js',
    {
        workerData: {
            "workerId": "1",
            "league": cluster.worker.id
        }
    });

process.on('message', (message) => {
    // console.log(`Received message in worker ${cluster.worker.id}:`);
    // console.log(message.event_type);
    if (message.event_type == "ADD_GAME") {
        // set up logic here later to check the game_jsons tick_placement 
        // to see which thread/cluster to place the game in
        thread1.postMessage({ event_type: "ADD_GAME", game_room: message.game_room });
    }
    // else if (message.event_type == "CHECK_QUEUE") {
    //     thread1.postMessage({ event_type: "CHECK_QUEUE" });
    //     // thread2.postMessage({ event_type: "CHECK_QUEUE" });
    //     // thread3.postMessage({ event_type: "CHECK_QUEUE" });
    // }
});

thread1.on('message', (message) => {
    // Handle messages from the workerlo from Worker: ${message.data['testing']}` });
    if (message.event_type == "RTC") {
        const THREAD_ID = message.RTC;
        process.send({ event_type: "RTC", RTC: true, threadId: THREAD_ID, workerId: cluster.worker.id });
    }
    else if (message.event_type == "ADDED_GAME") {
        // console.log("HITTING THIS ADDED GAME EVENT FROM THREADS");
        process.send({ event_type: "ADDED_GAME", gameId: message.gameId });
    }
});

thread1.on('error', (error) => {
    // Handle errors in the worker
    console.error(`Thread1 error: ${error}`);
});

thread1.on('exit', (code) => {
    // Handle worker exit
    console.log(`Thread1 exited with code ${code}`);
});