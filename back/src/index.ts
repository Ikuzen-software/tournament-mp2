import express = require('express');
import debug = require('debug');
import * as config from './config';
import * as WebSocket from 'ws';
import * as http from 'http';

console.log("Starting Application \s")

const userRoutePublic = require('./public/user-service/user-route')
const userRoutePrivate = require('./private/user-service/user-route')
const tournamentRoutePublic = require('./public/tournament-service/tournament-route')
const tournamentRoutePrivate = require('./private/tournament-service/tournament-route')
const matchRoutePublic = require('./public/match-service/match-route')
const matchRoutePrivate = require('./private/match-service/match-route')
const loginRoute = require('./public/login/login-route')
const tokenRoute = require('./public/token-route/token-route')
const cors = require('cors')
const mongoose = require('mongoose');
const fs = require('fs')
mongoose.connect(config.uri, { useNewUrlParser: true }).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});

const db = mongoose.connection
const log = debug('tn:express');
const app = express();
const PORT = 3000;
const BodyParser = require("body-parser");
export let privateKey: string;
fs.readFile('./keys/private.pem', (err, data) => {
    privateKey = data;
})

const server = http.createServer(app);



app.use(cors())
app.use(BodyParser.json());
app.use(cors());
app.use('/token', tokenRoute)
app.use('/login', loginRoute)
app.use('/user', userRoutePublic)
app.use('/user', userRoutePrivate)
app.use('/tournament', tournamentRoutePublic)
app.use('/tournament', tournamentRoutePrivate)
app.use('/match', matchRoutePublic)
app.use('/match', matchRoutePrivate)

db.once('open', function () {
    console.log("connected to the db")
});

app.get('/', (req, res) => {
    res.send(`<h1>tournament API</h1>`);
});

// WEBSOCKET //
//////////////
const wss = new WebSocket.Server({ server, port:8080 });
wss.on('connection', (ws: WebSocket) => {
    console.log("client connected un truc du genre")
    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);

        ws.send(`Hello, you sent -> ${message}`);
        
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(PORT || 8999, () => {
    console.log(`Server started on port ${PORT} :)`);
});


