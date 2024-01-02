const cluster = require('cluster');
const os = require('os');
const express = require('express');
const socket = require('socket.io');
const fs = require('fs')
var http = require("http");
class GameClient {
    constructor(_username, _socketId, _ready) {
        this.username = _username;
        this.socketId = _socketId;
        this.ready = _ready;
    }
    get_username() {
        return this.username;
    }
    get_socketId() {
        return this.socketId;
    }
    get_ready() {
        return this.ready;
    }
    set_ready(status) {
        this.ready = status;
    }
}
class GameRoom {
    constructor(_player1, _player2, _gameId) {
        this.player1 = _player1;
        this.player2 = _player2;
        this.gameId = _gameId;
    }

    set_player1(_player1) {
        this.player1 = _player1
    }

    set_player2(_player2) {
        this.player2 = _player2
    }

    get_player1() {
        return this.player1;
    }

    get_player2() {
        return this.player2;
    }

    send_tap(x, y, _to, _io) {
        var data = x + "|" + y;
        console.log(`Sending tap tp ${_to}`);
        _io.to(_to).emit('TAP', data);
    }
}
const DEBUG = true;
var all_threads_running = false;
var GAME_LOBBY_CLUSTER1 = null;
var GAME_LOBBY_CLUSTER2 = null;
var GAME_LOBBY_CLUSTER3 = null;
var GAME_LOBBY_CLUSTER4 = null;
var GAME_LOBBY_CLUSTER5 = null;
var GAME_LOBBY_CLUSTER6 = null;
var GAME_LOBBY_CLUSTER7 = null;
var GAME_LOBBY_CLUSTER8 = null; // will not be in use for now
var CUSTOM_GAME_CLUSTER = null; // do later
var clusters_and_threads = {}
var game_clients = new Map();
var game_clients_to_sockets = new Map();
var all_game_rooms = new Map();

if (cluster.isMaster) {
    const app = express()
    var PORT = process.env.PORT || 4567;
    const server = app.listen(PORT)
    app.use(express.static('public'));
    console.log("SERVER IS RUNNING ...");
    const io = socket(server);
    // Fork workers based on the number of CPU cores
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        if (i == 1) {
            break;
        }
        switch (i) {
            case 0:
                GAME_LOBBY_CLUSTER1 = cluster.fork();
                clusters_and_threads["GAME_LOBBY_CLUSTER1"] = {
                    "1": false,
                    "2": false,
                    "3": false,
                }
                console.log("GAME_LOBBY_CLUSTER1 is running...");
                break;
            case 1:
                GAME_LOBBY_CLUSTER2 = cluster.fork();
                clusters_and_threads["GAME_LOBBY_CLUSTER2"] = {
                    "1": false,
                    "2": false,
                    "3": false,
                }
                console.log("GAME_LOBBY_CLUSTER2 is running...");
                break;
            case 2:
                GAME_LOBBY_CLUSTER3 = cluster.fork();
                clusters_and_threads["GAME_LOBBY_CLUSTER3"] = {
                    "1": false,
                    "2": false,
                    "3": false,
                }
                console.log("GAME_LOBBY_CLUSTER3 is running...");
                break;
            case 3:
                GAME_LOBBY_CLUSTER4 = cluster.fork();
                clusters_and_threads["GAME_LOBBY_CLUSTER4"] = {
                    "1": false,
                    "2": false,
                    "3": false,
                }
                console.log("GAME_LOBBY_CLUSTER4 is running...");
                break;
            case 4:
                GAME_LOBBY_CLUSTER5 = cluster.fork();
                clusters_and_threads["GAME_LOBBY_CLUSTER5"] = {
                    "1": false,
                    "2": false,
                    "3": false,
                }
                console.log("GAME_LOBBY_CLUSTER5 is running...");
                break;
            case 5:
                GAME_LOBBY_CLUSTER6 = cluster.fork();
                clusters_and_threads["GAME_LOBBY_CLUSTER6"] = {
                    "1": false,
                    "2": false,
                    "3": false,
                }
                console.log("GAME_LOBBY_CLUSTER6 is running...");
                break;
            case 6:
                GAME_LOBBY_CLUSTER7 = cluster.fork();
                clusters_and_threads["GAME_LOBBY_CLUSTER7"] = {
                    "1": false,
                    "2": false,
                    "3": false,
                }
                console.log("GAME_LOBBY_CLUSTER7 is running...");
                break;
            case 7:
                CUSTOM_GAME_CLUSTER = cluster.fork();
                clusters_and_threads["CUSTOM_GAME_CLUSTER"] = {
                    "1": false,
                    "2": false,
                    "3": false,
                }
                console.log("CUSTOM_GAME_CLUSTER is running...");
                break;
            default:
                GAME_LOBBY_CLUSTER8 = cluster.fork();
                clusters_and_threads["GAME_LOBBY_CLUSTER8"] = {
                    "1": false,
                    "2": false,
                    "3": false,
                }
                console.log("GAME_LOBBY_CLUSTER8 is running...");
                break;
        }
    }
    // put io. calls under here
    // receive information about user from io. call
    temp_game_json1 = {
        "player1_token": "1ndkap4l687chfk4",
        "player2_token": "320bhbh4b9d4u9u5",
        "gameId": "dohe2o3horub4j4",
        "tick_placement": 2, // how long did it take to match the pairs up in the queue
    }
    temp_game_json2 = {
        "player1_token": "958hudu4j8j48j84",
        "player2_token": "01j3ind4ini4o00h",
        "gameId": "9c4ni92nmdkkwn3j",
        "tick_placement": 2, // how long did it take to match the pairs up in the queue
    }
    temp_game_json3 = {
        "player1_token": "82bduh8hr94ud490",
        "player2_token": "bbqkjek2j3j48k1k",
        "gameId": "1hjk3knn33j22k3j",
        "tick_placement": 2, // how long did it take to match the pairs up in the queue
    }
    temp_game_json4 = {
        "player1_token": "3nj4nij4n90202nj",
        "player2_token": "j4k2n2nj2k39nsjd",
        "gameId": "29shns2jkjonkaej",
        "tick_placement": 2, // how long did it take to match the pairs up in the queue
    }
    temp_game_json5 = {
        "player1_token": "5ndo39ndjw2jnwo0",
        "player2_token": "7chc7hsuwh2jwnjn",
        "gameId": "1wjsknjkn3kjnd33",
        "tick_placement": 2, // how long did it take to match the pairs up in the queue
    }
    temp_games = [temp_game_json1, temp_game_json2, temp_game_json3, temp_game_json4, temp_game_json5];
    // depending on league number send message to that cluster
    // send the location coordinates of the user and any other necessary info

    io.on('connection', (socket) => {

        io.to(socket.id).emit('connected', "CONNECTED");
        console.log("CONNECTED HERE");
        if (all_threads_running) {
            socket.on('GAMEID', (data) => {
                var data_split = data.split("|");
                var c_gameId = data_split[0];
                var c_username = data_split[1];
                var place = data_split[2];
                var new_client = null;
                var new_game_room = null;
                var completed_game_room = false;

                try {
                    // if getting client already before adding then disconnect user and remove from game client
                    new_client = game_clients.get(c_gameId + "|" + place);
                    new_client.set_gameId(c_gameId);
                    alreadyMade = true;
                }
                catch {
                    new_client = new GameClient(c_username, socket.id, false);
                    game_clients.set(c_gameId + "|" + place, new_client);
                    game_clients_to_sockets.set(socket.id, c_gameId);
                }

                if (place == "1") {
                    try {
                        new_game_room = all_game_rooms.get(c_gameId);
                        new_game_room.set_player1(new_client);
                        completed_game_room = true;
                    }
                    catch {
                        new_game_room = new GameRoom(new_client, null, c_gameId);
                        all_game_rooms.set(c_gameId, new_game_room);
                        io.to(socket.id).emit('GAMEID', "NOTYET");
                    }
                }
                else if (place == "2") {
                    try {
                        new_game_room = all_game_rooms.get(c_gameId);
                        new_game_room.set_player2(new_client);
                        completed_game_room = true;
                    }
                    catch {
                        new_game_room = new GameRoom(null, new_client, c_gameId);
                        all_game_rooms.set(c_gameId, new_game_room);
                        io.to(socket.id).emit('GAMEID', "NOTYET");
                    }
                }

                if (completed_game_room) {
                    io.to(new_game_room.player1.get_socketId()).emit('GAMEID', "SUCCESS");
                    io.to(new_game_room.player2.get_socketId()).emit('GAMEID', "SUCCESS");
                    // Do this later
                    // GAME_LOBBY_CLUSTER1.send({ event_type: 'ADD_GAME', game_room: new_game_room });
                }
            })
            socket.on('READY', (data) => {
                data_split = data.split("|");
                username = data_split[0];
                game_Id = data_split[1];
                var user = game_clients.get(game_Id + "|1");
                var user2 = game_clients.get(game_Id + "|2");

                if (user.get_username() == username) {
                    user.set_ready(true);
                    var message = user.get_ready() + "|" + user2.get_ready() + "|" + username
                    io.to(user2.get_socketId()).emit('READY', message);
                }
                else if (user2.get_username() == username) {
                    user2.set_ready(true);
                    var message = user2.get_ready() + "|" + user.get_ready() + "|" + username
                    io.to(user.get_socketId()).emit('READY', message);
                }
            })
            socket.on('STARTCGAME', (game_id) => {
                var user1 = game_clients.get(game_id + "|1");
                var user2 = game_clients.get(game_id + "|2");
                io.to(user1.get_socketId()).emit('STARTCGAME');
                io.to(user2.get_socketId()).emit('STARTCGAME');
            })
            socket.on('TAP', (index) => {
                var index_split1 = index.split("|")
                var index_split2 = index_split1[1].split("*")
                var x_index = index_split1[0]
                var y_index = index_split2[0]
                var game_id = index_split2[1]
                var user1 = game_clients.get(game_id + "|1");
                var user2 = game_clients.get(game_id + "|2");
                var sender = null;
                var reciever = null;
                var curr_game = all_game_rooms.get(game_id)
                if (user1.get_socketId() == socket.id) {
                    sender = user1;
                    reciever = user2;
                }
                else if (user2.get_socketId() == socket.id) {
                    sender = user2;
                    reciever = user1;
                }
                curr_game.send_tap(x_index, y_index, reciever.get_socketId(), io);
            })
            socket.on('REMOVEGAMECLIENT', (values) => {
                var values_split = values.split("|");
                var value = values_split[0];
                var game_id = values_split[1];
                var removed_user = get_user(game_id, socket.id)
                var removed_user_position = get_map_position(game_id, socket.id);
                if (value == "EXIT") {
                    game_clients.delete(removed_user_position);
                    try {
                        if (removed_user_position.split("|")[1] == "1") {
                            var user2 = game_clients.get(removed_user_position.split("|")[0] + "|2");
                            io.to(user2.get_socketId()).emit("DISCONNECT");
                        }
                        else if (removed_user_position.split("|")[1] == "2") {
                            var user2 = game_clients.get(removed_user_position.split("|")[0] + "|1");
                            io.to(user2.get_socketId()).emit("DISCONNECT");
                        }
                    }
                    catch {
                        console.log("ERROR EMITING TO OTHER CLIENT")
                    }
                }
                else {
                    game_clients.delete(removed_user_position);
                    game_clients_to_sockets.delete(socket.id);
                }
                if (removed_user != null) {
                    io.to(removed_user.get_socketId()).emit("REMOVEDUSER", value);
                }
            })
            socket.on('disconnect', () => {
                console.log("IN DISCONNECT HANDLER");
                try {
                    const curr_gameId = game_clients_to_sockets.get(socket.id);
                    const player1_key = curr_gameId + "|1";
                    const player2_key = curr_gameId + "|2";
                    const player1 = game_clients.get(player1_key);
                    const player2 = game_clients.get(player2_key);
                    if (player1) {
                        game_clients.delete(player1_key);
                        game_clients_to_sockets.delete(player1.get_socketId());
                    }
                    if (player2) {
                        game_clients.delete(player2_key);
                        game_clients_to_sockets.delete(player2.get_socketId());
                    }
                }
                catch {
                    console.log("CLIENT ALREADY LEFT");
                }
            })

            socket.on('error', () => {
                try {
                    const curr_gameId = game_clients_to_sockets.get(socket.id);
                    const player1_key = curr_gameId + "|1";
                    const player2_key = curr_gameId + "|2";
                    const player1 = game_clients.get(player1_key);
                    const player2 = game_clients.get(player2_key);
                    if (player1) {
                        game_clients.delete(player1_key);
                        game_clients_to_sockets.delete(player1.get_socketId());
                    }
                    if (player2) {
                        game_clients.delete(player2_key);
                        game_clients_to_sockets.delete(player2.get_socketId());
                    }
                }
                catch {
                    console.log("CLIENT ALREADY LEFT");
                }
            })
        }
    })

    // wait for responses from threads
    cluster.on('message', (worker, message, handle) => {
        if (message.event_type == "RTC") {
            console.log(`Running game lobby in Cluster: ${message.workerId} Thread: ${message.threadId}`);
            turn_game_threads_on(message.workerId, message.threadId, false);
            console.log(clusters_and_threads)
            check_threads_are_up()
        }
        else if (all_threads_running) {
            if (message.event_type == "ADDED_GAME") {
                console.log(`ADDED GAME: ${message.gameId} to the game lobby.`);
                const GAME_ROOM_CREATED = all_game_rooms.get(message.gameId)
                io.to(GAME_ROOM_CREATED.get_player1().get_socketId()).emit('GAMEID', "SUCCESS");
                io.to(GAME_ROOM_CREATED.get_player2().get_socketId()).emit('GAMEID', "SUCCESS");
            }
        }
        else {
            console.log("Threads are off.");
        }
    });

    // handle moving user to different cluster if wait time too long; maybe also
    // handle sending information about moving from thread to thread as well

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        // You can decide to fork a new worker here
    });
} else {
    // This is your actual server logic for either the queue or the game server
    require('./test_game_server_threads.js');

    // process.on('message', (message) => {
    //     console.log(`Received message in worker ${cluster.worker.id}:`, message);
    // });
}

function turn_game_threads_on(cluster, thread, checking) {
    switch (cluster) {
        case 1:
            if (thread == 1) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER1"]["1"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER1"]["1"] = true
                }
            }
            else if (thread == 2) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER1"]["2"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER1"]["2"] = true
                }
            }
            else {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER1"]["3"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER1"]["3"] = true
                }
            }
            break;
        case 2:
            if (thread == 1) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER2"]["1"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER2"]["1"] = true
                }
            }
            else if (thread == 2) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER2"]["2"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER2"]["2"] = true
                }
            }
            else {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER2"]["3"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER2"]["3"] = true
                }
            }
            break;
        case 3:
            if (thread == 1) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER3"]["1"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER3"]["1"] = true;
                }
            }
            else if (thread == 2) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER3"]["2"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER3"]["2"] = true;
                }
            }
            else {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER3"]["3"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER3"]["3"] = true;
                }
            }
            break;
        case 4:
            if (thread == 1) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER4"]["1"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER4"]["1"] = true
                }
            }
            else if (thread == 2) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER4"]["2"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER4"]["2"] = true
                }
            }
            else {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER4"]["3"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER4"]["3"] = true
                }
            }
            break;
        case 5:
            if (thread == 1) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER5"]["1"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER5"]["1"] = true
                }
            }
            else if (thread == 2) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER5"]["2"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER5"]["2"] = true
                }
            }
            else {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER5"]["3"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER5"]["3"] = true
                }
            }
            break;
        case 6:
            if (thread == 1) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER6"]["1"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER6"]["1"] = true
                }
            }
            else if (thread == 2) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER6"]["2"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER6"]["2"] = true
                }
            }
            else {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER6"]["3"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER6"]["3"] = true
                }
            }
            break;
        case 7:
            if (thread == 1) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER7"]["1"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER7"]["1"] = true
                }
            }
            else if (thread == 2) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER7"]["2"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER7"]["2"] = true
                }
            }
            else {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER7"]["3"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER7"]["3"] = true
                }
            }
            break;
        case 8:
            if (thread == 1) {
                if (checking) {
                    return clusters_and_threads["CUSTOM_GAME_CLUSTER"]["1"];
                } else {
                    clusters_and_threads["CUSTOM_GAME_CLUSTER"]["1"] = true
                }
            }
            else if (thread == 2) {
                if (checking) {
                    return clusters_and_threads["CUSTOM_GAME_CLUSTER"]["2"];
                } else {
                    clusters_and_threads["CUSTOM_GAME_CLUSTER"]["2"] = true
                }
            }
            else {
                if (checking) {
                    return clusters_and_threads["CUSTOM_GAME_CLUSTER"]["3"];
                } else {
                    clusters_and_threads["CUSTOM_GAME_CLUSTER"]["3"] = true
                }
            }
            break;
        default:
            if (thread == 1) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER8"]["1"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER8"]["1"] = true
                }
            }
            else if (thread == 2) {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER8"]["2"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER8"]["2"] = true
                }
            }
            else {
                if (checking) {
                    return clusters_and_threads["GAME_LOBBY_CLUSTER8"]["3"];
                } else {
                    clusters_and_threads["GAME_LOBBY_CLUSTER8"]["3"] = true
                }
            }
            break;
    }
}

function check_threads_are_up() {
    all_game_threads_up = true;
    for (var i = 1; i < 9; i++) {
        if (i == 2) {
            all_game_threads_up = true;
            break;
        }
        for (var j = 1; j < 4; j++) {
            if (j == 2) {
                break;
            }
            all_game_threads_up = turn_game_threads_on(i, j, true)
        }
    }
    if (all_game_threads_up) {
        all_threads_running = true;
        return true;
    }
    else {
        all_threads_running = false;
        return false;
    }
}

function get_user(game_id, socket_id) {

    try {
        var user = game_clients.get(game_id + "|1");
        if (user.get_socketId() == socket_id) {
            return user;
        }
        else {
            user = game_clients.get(game_id + "|2");
            if (user.get_socketId() == socket_id) {
                return user;
            }
            else {
                console.log("USER NOT IN CLIENTS");
                return null;
            }
        }
    }
    catch {
        var user = game_clients.get(game_id + "|2");
        if (user.get_socketId() == socket_id) {
            return user;
        }
        else {
            console.log("USER NOT IN CLIENTS");
            return null;
        }
    }
}

function get_map_position(game_id, socket_id) {

    try {
        var user = game_clients.get(game_id + "|1");
        if (user.get_socketId() == socket_id) {
            return game_id + "|1";
        }
        else {
            user = game_clients.get(game_id + "|2");
            if (user.get_socketId() == socket_id) {
                return game_id + "|2";
            }
            else {
                console.log("USER NOT IN CLIENTS");
                return null;
            }
        }
    }
    catch {
        var user = game_clients.get(game_id + "|2");
        if (user.get_socketId() == socket_id) {
            return game_id + "|2";
        }
        else {
            console.log("USER NOT IN CLIENTS");
            return null;
        }
    }
}