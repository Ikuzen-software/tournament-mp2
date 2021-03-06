import express = require('express');
import debug = require('debug');
import * as config from './config';

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


app.use(cors({ origin: config.allowedOrigins }))
app.use(BodyParser.json());
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

app.listen(PORT, () => log('Listening on port', PORT));

