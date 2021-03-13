import { TournamentModel } from '../../models/tournaments/tournament-model'
import * as _ from "lodash"
import { MatchModel } from '../../models/matches/matches-model';
import * as tournamentTree from '../../utils/fight-tree'
import { Match } from '../../models/matches/matches-interface';
import { allowedOrigins } from '../../config';
const mongoosePaginate = require('mongoose-paginate-v2');

const express = require('express');
const tournamentRouter = express.Router();

tournamentRouter.get("/", async (request, response) => {
    try {
        let paginationQuery = {
            limit: request.query.limit,
            page: request.query.page
        }
        if (!paginationQuery.limit) {
            paginationQuery.limit = 12;
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
    const standingArray = await tournamentTree.getStanding(request, response);
    response.send(standingArray)
});

module.exports = tournamentRouter;
