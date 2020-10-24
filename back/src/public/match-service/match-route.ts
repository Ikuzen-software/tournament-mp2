import { isTournamentOwner, getUserFromToken } from '../../auth';
import {MatchModel} from '../../models/matches/matches-model'
import { TournamentModel } from '../../models/tournaments/tournament-model';
import * as tournamentTree from '../../utils/fight-tree'
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

matchRouter.get("/seeding/:tnId", async (request, response) => { 
    try {
        const tournament = await TournamentModel.findById(request.params.tnId).exec();
        const playersList = tournament.participants.map(user => user.username);
        console.log(playersList)
        const tree = tournamentTree.createTree(playersList);
        const result = tournamentTree.predictAllRounds(tree);
        response.send(result)
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});


module.exports = matchRouter;
