import { TournamentModel } from '../../models/tournaments/tournament-model'
import { jwtMW, isTournamentOwner, isAdmin, isLoggedIn, getUserFromToken, isReportable } from '../../auth';
import { MatchModel } from '../../models/matches/matches-model';
import * as tournamentTree from '../../utils/fight-tree'
import { TournamentNode } from '../../utils/fight-tree';
import * as _ from 'lodash'
import { Match } from '../../models/matches/matches-interface';
import {STATUS as MATCH_STATUS} from "../../models/matches/match-status.enum"
import { allowedOrigins } from '../../config';
const express = require('express');
const matchRouter = express.Router();
const cors = require('cors')
matchRouter.use(cors({ origin: allowedOrigins }))
matchRouter.use(jwtMW);

// CREATE all matches from a single elimination tournament
//TODO : have a seeding list
matchRouter.post("/many/:id", isTournamentOwner, async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.id).exec();
        const playersList = tournament.participants
        const tree = tournamentTree.createTree(playersList);
        const matchList =[]
        const treeArray = tournamentTree.getArrayOfMatchesInOrderAndSetIdentifier(tree.root);
        for (let i = 0; i < treeArray.length; i++) {
            const current = treeArray[i]
            let player1_id, player2_id;
            !(current.a instanceof TournamentNode) ? player1_id = current?.a?.participant_id : player1_id = null;
            !(current.b instanceof TournamentNode) ? player2_id = current?.b?.participant_id : player2_id = null;
            const tournamentId = tournament._id;
            const identifier = current.identifier
            let match = new MatchModel({
                player1_id: player1_id,
                player2_id: player2_id,
                tournament_id: tournamentId,
                identifier: identifier
            });
            if(match.player1_id && match.player2_id){
                match.matchState = MATCH_STATUS.readyToStart
            }
            matchList.push(match)
            const matchResult = await match.save();
        }
        response.send(matchList)

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

//Report a match result if match can be reported only
matchRouter.put("/report", isReportable, async (request, response) => {
    try {

        // check if participant can report or not
        const match = await MatchModel.findOne({ tournament_id: request.body.tournament_id, identifier: request.body.identifier }).exec();
        //checks if the ids are from the correct players
        if (request.body.winner_id === request.body.loser_id
            || request.body.score.split('-')[0] === request.body.score.split('-')[1]
            || _.difference([match.player1_id, match.player2_id], [request.body.winner_id, request.body.loser_id]).length !== 0
        ) {
            response.status(400).send({ error: "score or winner/loser not suitably reported" })
        }else if(match.matchState !== MATCH_STATUS.readyToStart){
            response.status(400).send({ error: "can't report a match which isn't ready to start" })
        }
        else {
            console.log(request.body)
            match.winner_id = request.body.winner_id
            match.loser_id = request.body.loser_id
            match.score = request.body.score
            match.matchState = MATCH_STATUS.finished
            await match.save();
            const tournament = await TournamentModel.findById(request.body.tournament_id)
            const playersList = tournament.participants.map((user) => user.username);
            const tree = tournamentTree.createTree(playersList);
            const arrayRounds = tournamentTree.getTreeRounds(tree);
            let nextMatch, round, position;
            for (let i = 0; i < arrayRounds.length; i++) {
                for (let j = 0; j < arrayRounds[i].length; j++) {
                    const node = arrayRounds[i][j]
                    if (!(node instanceof tournamentTree.Player) && node.identifier === parseInt(request.body.identifier)) {
                        // fetch the next match from next round
                        nextMatch = arrayRounds?.[i + 1]?.[Math.floor(j / 2)]
                        round = i;
                        position = j
                    }
                }
            }

            //handling the next match parameters
            if (nextMatch) {
                // find match where identifier is :
                const secondMatch = await MatchModel.find({ identifier: nextMatch.identifier, tournament_id: request.body.tournament_id }).exec();
                if (secondMatch) {
                    //if position multiple of 2, determines if player1 or player2 of next match
                    if (position % 2 === 0) {
                        secondMatch[0].player1_id = match.winner_id;
                    } else if (position % 2 !== 0) {
                        secondMatch[0].player2_id = match.winner_id;
                    }

                    //set ready to start if both players id
                    if(secondMatch[0]?.player1_id && secondMatch[0]?.player2_id){
                        secondMatch[0].matchState = MATCH_STATUS.readyToStart
                    }

                    await secondMatch[0].save();
                }
            }
            response.send(match);
        }
    } catch (error) {
        console.log(error)
        response.status(500).send(error);
    }
});



module.exports = matchRouter;
