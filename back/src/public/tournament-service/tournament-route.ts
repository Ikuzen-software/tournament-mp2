import { TournamentModel } from '../../models/tournaments/tournament-model'
import * as _ from "lodash"
import { MatchModel } from '../../models/matches/matches-model';
import * as tournamentTree from '../../utils/fight-tree'
import { Match } from '../../models/matches/matches-interface';
const mongoosePaginate = require('mongoose-paginate-v2');

const express = require('express');
const tournamentRouter = express.Router();
const cors = require('cors')
tournamentRouter.use(cors({ origin: 'http://localhost:4200' }))

tournamentRouter.get("/", async (request, response) => {
    try {
        let paginationQuery = {
            limit: request.query.limit,
            page: request.query.page
        }
        if (!paginationQuery.limit) {
            paginationQuery.limit = 10;
        }
        if (!paginationQuery.page) {
            paginationQuery.page = 1
        }
        let tournamentQueries = {}
        /// GET tournaments where participant is the query
        if (request.query.participant) {
            tournamentQueries["participants.username"] = request.query.participant
        }
        /// GET tournaments where organizer is the query
        if (request.query.organizer) { // 
            tournamentQueries["organizer.username"] = request.query.organizer
        }
        //fusing both query for OR condition
        if (request.query.organizer && request.query.participant) {
            tournamentQueries = { $or: [{ "organizer.username": request.query.organizer }, { "participants.username": request.query.participant }] }
        }
        /// GET with status
        if (request.query.status) { // 
            tournamentQueries["status"] = request.query.status
        }
        /// GET with game
        if (request.query.game) { // 
            tournamentQueries["game"] = request.query.game
        }
        if (_.isEmpty(tournamentQueries)) { // set to undefined for mongoose paginate
            tournamentQueries = undefined;
        }

        const tournaments = await TournamentModel.paginate(tournamentQueries, paginationQuery, 1, function (error, pageCount, paginatedResults) {
            if (error) {
                response.status(404).send(error);
            }
        })
        response.send(tournaments);
    } catch (error) {
        response.status(404).send(`tournaments not found`);
    }
});
tournamentRouter.get("/:id", async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.id).exec();
        response.send(tournament);
    } catch (error) {
        response.status(404).send(`tournament ${request.params.id} not found`);
    }
});

tournamentRouter.get("/name/:name", async (request, response) => {
    try {
        const tournament = await TournamentModel.findOne({ name: request.params.name }).exec();
        response.send(tournament);
    } catch (error) {
        response.status(404).send(`tournament ${request.params.name} not found`);
    }
});
tournamentRouter.get("/other/games", async (request, response) => {
    try {
        let games = await TournamentModel.find().select('game').exec();
        games = [... new Set(games.map(data => data.game))] // filter to unique game
        games = games.filter(game => game !== 'NA')
        response.send(games);
    } catch (error) {
        response.status(404).send(`games not found`);
    }
});

tournamentRouter.get("/other/size/:id", async (request, response) => {
    try {
        let tournament = await TournamentModel.findById(request.params.id).exec();
        if (tournament.size >= tournament.participants.length) {
            response.send("not full");
        } else {
            response.send("full")
        }
    } catch (error) {
        console.log(error)
        response.status(404).send(`tournament not found`);
    }
});



// get match current standing
tournamentRouter.get("/getStanding/:tnId", async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.tnId).exec();
        const playersList = tournament.participants
        const tree = tournamentTree.createTree(playersList);
        const roundsArray = tournamentTree.getTreeRounds(tree);
        const numberOfRounds = roundsArray.length;
        const standingArray: {
            username: string,
            participant_id: string,
            rank: number,
            matchesPlayed: Match[]
        }[] = [];
        const matches = await MatchModel.find({ tournament_id: request.params.tnId }).exec();
        for (let i = roundsArray.length - 1; i >= 0; i--) {
            const currentRound = roundsArray[i]
            for (let j = currentRound.length - 1; j >= 0; j--) {
                const currentMatch = roundsArray[i][j]
                if (!(currentMatch instanceof tournamentTree.Player) && currentMatch?.identifier && matches[currentMatch.identifier - 1].matchState !== "not started") {
                    const winner = playersList.find(player => player.participant_id === matches[currentMatch.identifier - 1].winner_id)
                    const loser = playersList.find(player => player.participant_id === matches[currentMatch.identifier - 1].loser_id)
                    let winnerPlayer, loserPlayer;
                    winnerPlayer = { username: winner.username, participant_id: winner.participant_id, rank: numberOfRounds - i < 3 ? numberOfRounds - i : roundsArray[i].length + 1 , matchesPlayed: [matches[currentMatch.identifier - 1]]}
                    loserPlayer = { username: loser.username, participant_id: loser.participant_id, rank: numberOfRounds - i + 1 < 3 ? numberOfRounds - i + 1 : roundsArray[i].length + 1 , matchesPlayed: [matches[currentMatch.identifier - 1]] }
                    if (!standingArray.find((participant) => participant.participant_id === winnerPlayer.participant_id)) {
                        standingArray.push(winnerPlayer)
                    }else{
                        standingArray.find((participant) => participant.participant_id === winnerPlayer.participant_id).matchesPlayed.push(matches[currentMatch.identifier - 1])
                    }
                    if (!standingArray.find((participant) => participant.participant_id === loserPlayer.participant_id)) {
                        standingArray.push(loserPlayer)
                    }else{
                        standingArray.find((participant) => participant.participant_id === loserPlayer.participant_id).matchesPlayed.push(matches[currentMatch.identifier - 1])
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

module.exports = tournamentRouter;
