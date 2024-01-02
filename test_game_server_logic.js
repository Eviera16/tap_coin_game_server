const { workerData, parentPort } = require('worker_threads');

var all_game_rooms = {}

// This is your logic for the worker thread
const data = workerData;
parentPort.postMessage({ event_type: "RTC", RTC: data.workerId });

parentPort.on('message', (message) => {
    // console.log(`Received message right here in worker ${data.workerId}:`, message['content']['token']);
    // console.log(`Message Event Type Within Thread: ${message["event_type"]}`)
    if (message["event_type"] == "ADD_GAME") {
        const new_game_room = message["game_room"]
        all_game_rooms[new_game_room.gameId] = new_game_room;
        console.log("ALL GAME ROOMS HERE: ", all_game_rooms)
        parentPort.postMessage({ event_type: "ADDED_GAME", gameId: new_game_room.gameId });
    }
});