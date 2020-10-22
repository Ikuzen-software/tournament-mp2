import {MatchModel} from '../../models/matches/matches-model'
const express = require('express');
const cors = require('cors')
const matchRouter = express.Router();
matchRouter.use(cors({origin: 'http://localhost:4200'}))

//GET all matches from a tournament
matchRouter.get("/", async (request, response) => {
    try {
        const matches = await MatchModel.find();
        response.send(matches);
    } catch (error) {
        console.log(error)
        response.status(404).send(error);
    }
});

//GET Match by id

matchRouter.get("/:id", async (request, response) => {
    try {
        const user = await MatchModel.findById(request.params.id);
        response.send(user);
    } catch (error) {
        response.status(404).send(`match ${request.params.id}not found`);
    }
});


module.exports = matchRouter;
