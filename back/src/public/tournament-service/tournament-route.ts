import { TournamentModel } from '../../models/tournaments/tournament-model'
import * as _ from "lodash"
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
        if(!paginationQuery.page) {
            paginationQuery.page = 1
        }
        let tournamentQuery = {}

        /// GET tournaments where participant is the query
        if(request.query.participant){
            tournamentQuery["participants.username"] = request.query.participant
        }
        /// GET tournaments where organizer is the query
        if(request.query.organizer){ // 
            tournamentQuery["organizer.username"] =  request.query.organizer
        }
        if(_.isEmpty(tournamentQuery)){ // set to undefined for mongoose paginate
            tournamentQuery = undefined;
        }
        console.log(tournamentQuery)
        const tournaments = await TournamentModel.paginate(tournamentQuery, paginationQuery , 1, function (error, pageCount, paginatedResults) {
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
        if(tournament.size >= tournament.participants.length){
            response.send("not full");
        }else{
            response.send("full")
        }
    } catch (error) {
        console.log(error)
        response.status(404).send(`tournament not found`);
    }
});

// tournamentRouter.get("/name/:name", async (request, response) => {
//     try {
//         const tournament = await TournamentModel.find({name: new RegExp(`^${request.params.name}`)}).exec();
//         response.send(tournament);
//     } catch (error) {
//         response.status(500).send(error);
//     }
// });

module.exports = tournamentRouter;
