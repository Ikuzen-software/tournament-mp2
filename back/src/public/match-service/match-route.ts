import { match } from 'assert';
import { nodeModuleNameResolver } from 'typescript';
import { isTournamentOwner, getUserFromToken } from '../../auth';
import { allowedOrigins } from '../../config';
import { MatchModel } from '../../models/matches/matches-model'
import { TournamentModel } from '../../models/tournaments/tournament-model';
import * as tournamentTree from '../../utils/fight-tree'
const express = require('express');
const matchRouter = express.Router();

//GET all matches from a tournament
matchRouter.get("/all/:id", async (request, response) => {
    try {
        const matches = await MatchModel.find({ tournament_id: request.params.id });
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
// gets a tree of the tournament with players name and id
matchRouter.get("/getArrayOfRounds/:tnId", async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.tnId).exec();
        const playersList = tournament.participants;
        const tree = tournamentTree.createTree(playersList);
        const result = tournamentTree.getTreeRounds(tree);
        response.send(result)
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});
// get an array of the tournament that is readable for the bracket component
matchRouter.get("/getTreeArrayForComponent/:id", async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.id).exec();
        const playersList = tournament.participants.map((user, index) => (index + 1) + " " + user.username);
        const tree = tournamentTree.createTree(playersList);
        const result = tournamentTree.convertTreeToArray(tree);
        const matches = await MatchModel.find({ tournament_id: request.params.id });
        for (let node of result) {
            if (node.identifier) {
                matches.filter((match) => match.identifier.toString() === node.identifier.toString()).map((match) => {
                    if (match.winner_id) {
                        let winnerSeed = tournament.participants.findIndex((participant) => participant.participant_id == match.winner_id);
                        const winnerName = tournament.participants[winnerSeed].username
                        node.label = (winnerSeed + 1) + " " + winnerName
                    }
                }
                )
            }
        }
        response.send(result)
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});

// get an array of the matches played in order, and with an identifier
matchRouter.get("/getTreeArray/:tnId", async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.tnId).exec();
        const playersList = tournament.participants
        const tree = tournamentTree.createTree(playersList);
        const result = tournamentTree.getArrayOfMatchesInOrderAndSetIdentifier(tree.root);
        response.send(result)
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});


module.exports = matchRouter;
