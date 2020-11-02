import { TournamentModel } from '../../models/tournaments/tournament-model'
import { jwtMW, isTournamentOwner, isAdmin, isLoggedIn, getUserFromToken } from '../../auth';
import { MatchModel } from '../../models/matches/matches-model';
import * as tournamentTree from '../../utils/fight-tree'
import { TournamentNode } from '../../utils/fight-tree';
const express = require('express');
const matchRouter = express.Router();
const cors = require('cors')
matchRouter.use(cors({ origin: 'http://localhost:4200' }))
matchRouter.use(jwtMW);

// CREATE all matches from a single elimination tournament
//TODO : have a seeding list
matchRouter.post("/many/:id", isTournamentOwner, async (request, response) => { 
    try {
        const tournament = await TournamentModel.findById(request.params.id).exec();
        const playersList = tournament.participants
        const tree = tournamentTree.createTree(playersList);
        const treeArray = tournamentTree.getArrayOfMatchesInOrderAndSetIdentifier(tree.root);
        for(let i=0; i<treeArray.length; i++){
                const current = treeArray[i]
                let player1_id, player2_id;
                !(current.a instanceof TournamentNode) ? player1_id = current.a.participant_id :  player1_id = null;
                !(current.b instanceof TournamentNode) ? player2_id = current.b.participant_id :  player2_id = null;
                const tournamentId = tournament._id;
                const identifier = current.identifier
                let match = new MatchModel({
                    player1_id:player1_id,
                    player2_id: player2_id,
                    tournament_id: tournamentId,
                    identifier: identifier
                });
                const matchResult = await match.save();
            }
        response.send({result: 'successfully created matches'})
        
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});

//DELETE all matches from a tournament
matchRouter.delete("/many/:id", isTournamentOwner, async (request, response) => { 
    try {
            const result = await MatchModel.deleteMany({ tournament_id: request.params.id }).exec();
            response.send(result);
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
