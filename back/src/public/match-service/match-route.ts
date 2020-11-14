import { match } from 'assert';
import { nodeModuleNameResolver } from 'typescript';
import { isTournamentOwner, getUserFromToken } from '../../auth';
import { MatchModel } from '../../models/matches/matches-model'
import { TournamentModel } from '../../models/tournaments/tournament-model';
import * as tournamentTree from '../../utils/fight-tree'
const express = require('express');
const cors = require('cors')
const matchRouter = express.Router();
matchRouter.use(cors({ origin: 'http://localhost:4200' }))

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


// get match current standing
matchRouter.get("/getStanding/:tnId", async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.tnId).exec();
        const playersList = tournament.participants
        const tree = tournamentTree.createTree(playersList);
        const roundsArray = tournamentTree.getTreeRounds(tree);
        const numberOfRounds = roundsArray.length;
        console.log(roundsArray)
        const standingArray = [];
        const matches = await MatchModel.find({ tournament_id: request.params.tnId }).exec();
        for (let i = roundsArray.length - 1; i >= 0; i--) {
            const currentRound = roundsArray[i]
            for (let j = currentRound.length - 1; j >= 0; j--) {
                const currentMatch = roundsArray[i][j]
                if (!(currentMatch instanceof tournamentTree.Player) && currentMatch?.identifier && matches[currentMatch.identifier - 1].matchState !== "not started") {
                    const winner = playersList.find(player => player.participant_id === matches[currentMatch.identifier - 1].winner_id)
                    const loser = playersList.find(player => player.participant_id === matches[currentMatch.identifier - 1].loser_id)
                    let winnerPlayer, loserPlayer;
                    console.log("num or rounds "+ numberOfRounds)
                    console.log("current round "+ (i+1))
                    winnerPlayer = { username: winner.username, participant_id: winner.participant_id, round: i + 1, rank: numberOfRounds-i < 3 ? numberOfRounds-i : roundsArray[i].length +1  }
                    loserPlayer = { username: loser.username, participant_id: loser.participant_id, round: i + 1, rank:numberOfRounds-i+1 < 3 ? numberOfRounds-i+1 : roundsArray[i].length+1 }
                    if (!standingArray.find((participant) => participant.participant_id === winnerPlayer.participant_id)) {
                        standingArray.push(winnerPlayer)
                    }
                    if (!standingArray.find((participant) => participant.participant_id === loserPlayer.participant_id)) {
                        standingArray.push(loserPlayer)
                    }
                }
            }
        }

        response.send(standingArray)
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});

module.exports = matchRouter;
