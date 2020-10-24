import { TournamentModel } from '../../models/tournaments/tournament-model'
import { jwtMW, isTournamentOwner, isAdmin, isLoggedIn, getUserFromToken } from '../../auth';
import { MatchModel } from '../../models/matches/matches-model';
const express = require('express');
const matchRouter = express.Router();
const cors = require('cors')
matchRouter.use(cors({ origin: 'http://localhost:4200' }))
matchRouter.use(jwtMW);

// CREATE all matches from a single elimination tournament
//TODO : have a seeding list
matchRouter.post("/many", isTournamentOwner, async (request, response) => { 
    try {
        let token = request.headers.authorization?.split(' ')[1];
        const user = getUserFromToken(token);
        if (request.body?.organizer?.username !== user.username && request.body?.organizer?.organizer_id !== user._id) {
            response.status(500).send('organizer must be the same as the tournament creator')
        }else{
            // for(let i=0; i<){
            //     let match = new MatchModel(request.body);
            //     const matchResult = await match.save();
            //     response.send(matchResult);
            // }
        }
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});


// CREATE single match
matchRouter.post("/", isTournamentOwner, async (request, response) => { 
    try {
        let token = request.headers.authorization?.split(' ')[1];
        const user = getUserFromToken(token);
        if (request.body?.organizer?.username !== user.username && request.body?.organizer?.organizer_id !== user._id) {
            response.status(500).send('organizer must be the same as the tournament creator')
        }else{
            let match = new MatchModel(request.body);
            const matchResult = await match.save();
            response.send(matchResult);
        }
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});

module.exports = matchRouter;
