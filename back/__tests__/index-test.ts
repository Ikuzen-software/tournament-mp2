import express from 'express';
import debug from 'debug';

console.log("Starting Application \s")

const userRoutePublic = require('../src/public/user-service/user-route')
const userRoutePrivate = require('../src/private/user-service/user-route')
const tournamentRoutePublic = require('../src/public/tournament-service/tournament-route')
const tournamentRoutePrivate = require('../src/private/tournament-service/tournament-route')
const loginRoute = require('../src/public/login/login-route')
const tokenRoute = require('../src/public/token-route/token-route')
const cors = require('cors')
const fs = require('fs')

const log = debug('tn:express');
const app = express();
const PORT = 3000;
const BodyParser = require("body-parser");
export let privateKey: string;
fs.readFile('./keys/private.pem', (err, data) => {
    privateKey = data;
})


app.use(cors())
app.use(BodyParser.json());
app.use(cors());
app.use('/token', tokenRoute)
app.use('/login', loginRoute)
app.use('/user', userRoutePublic)
app.use('/user', userRoutePrivate)
app.use('/tournament', tournamentRoutePublic)
app.use('/tournament', tournamentRoutePrivate)

app.get('/', (req, res) => {
    res.send(`<h1>tournament API</h1>`);
});

module.exports = app
