import { TournamentModel } from '../../models/tournaments/tournament-model'
import { jwtMW, isTournamentOwner, isAdmin, isLoggedIn, getUserFromToken } from '../../auth';
import { Tournament } from '../../models/tournaments/tournament-interface';
import { UserModel } from '../../models/users/user-model';
import { STATUS as TnStatus } from '../../models/tournaments/tournament-status.enum';
import * as _ from "lodash"
import { MatchModel } from '../../models/matches/matches-model';
import * as tournamentTree from '../../utils/fight-tree'
import {allowedOrigins} from '../../config'

const express = require('express');
const tournamentRouter = express.Router();
const cors = require('cors')
tournamentRouter.use(cors({ origin: allowedOrigins }))
tournamentRouter.use(jwtMW);

tournamentRouter.post("/", isLoggedIn, async (request, response) => {
    try {
        let token = request.headers.authorization?.split(' ')[1];
        const user = getUserFromToken(token);
        if (request.body?.organizer?.username !== user.username && request.body?.organizer?.organizer_id !== user._id) {
            response.status(400).send('organizer must be the same as the tournament creator')
        }
        const tournament = new TournamentModel(request.body);
        const userResult = await UserModel.findById(user._id).exec()
        userResult.tournaments.push({ tournament_id: tournament._id, name: tournament.name })
        const tournamentResult = await tournament.save();
        response.send(tournamentResult);
    } catch (error) {
        console.log(error)
        response.status(400).send(error);
    }
});
// full modification
tournamentRouter.put("/:id", isTournamentOwner, async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.id).exec();
        tournament.set(request.body);
        const token = request.headers.authorization?.split(" ")[1];
        const user = getUserFromToken(token);
        const organizer = await UserModel.findById(user._id);
        organizer.tournaments.push({ _id: user.id, username: user.username })
        const organizerResult = await organizer.save();
        const tournamentResult = await tournament.save();
        response.send(tournamentResult);
    } catch (error) {
        response.status(404).send(`tournament ${request.params.id} not found`);
    }
});
// joining a tournament
tournamentRouter.put("/join/:id", isLoggedIn, async (request, response) => {
    try {
        const user = request.body;
        if (user.username) {
            if (getUserFromToken(request.headers.authorization?.split(' ')[1]).username !== user.username) {
                response.status(403).send(`participant ${user.username} is not the authentified user`);
            } else {
                const tournament = await TournamentModel.findById(request.params.id).exec();
                // case tournament status isn't "not started"
                if (tournament.status !== TnStatus.notStarted) {
                    response.status(400).send(`Cannot join a tournament that is either started or finished`)
                }
                else {
                    // case tournament is full
                    if (tournament.participants.length >= tournament.size) {
                        response.status(400).send('tournament is full')
                    } else {
                        if (tournament.participants.filter(participant => participant.username === user.username).length > 0) {
                            response.status(400).send(`participant ${user.username} has already joined the tournament`);
                        }
                        else { //When success
                            tournament.participants.push({ participant_id: user.id, username: user.username });
                            const tournamentResult = await tournament.save({ upsert: true });
                            const participant = await UserModel.findById(user.id).exec();
                            if (tournamentResult?.organizer?.username === participant.username) { // case participant is also owner
                                participant.overview.totalOrganized++;
                            } else { // case not owner
                                participant.tournaments.push({ name: tournament.name, tournament_id: tournament._id });
                                participant.overview.totalParticipated++;
                            }
                            const participantResult = await participant.save({ upsert: true });
                            response.send(tournamentResult);
                        }
                    }
                }
            }
        } else {
            response.status(400).send(`request body is not a user`)
        }
    } catch (error) {
        console.log(error)
        response.status(404).send(`tournament ${request.params.id} not found`);
    }
});
//leaving a tournament 
tournamentRouter.put("/leave/:id", isLoggedIn, async (request, response) => {
    try {
        const user = request.body;
        if (user.username) {
            if (getUserFromToken(request.headers.authorization?.split(' ')[1]).username !== user.username) {
                response.status(401).send(`participant ${user.username} is not the authentified user`);
            } else {
                let tournament = await TournamentModel.findById(request.params.id).exec();
                if (tournament.status !== TnStatus.notStarted) {
                    response.status(401).send(`Cannot leave a tournament that is either started or finished`)
                } else {

                    tournament.participants = tournament.participants.filter(participant => participant.username !== user.username)
                    let participant = await UserModel.findById(user.id).exec();
                    if (participant.username === tournament?.organizer?.username) {// if owner
                        participant.overview.totalParticipated--;
                    } else {
                        participant.tournaments = participant.tournaments.filter(_tournament => tournament.name === _tournament.name && tournament._id === _tournament.tournament_id);
                        participant.overview.totalParticipated--;
                    }
                    const tournamentResult = await tournament.save()
                    const userResult = await participant.save()
                    response.send(tournamentResult)
                }
            }
        } else {
            response.status(400).send(`request body is not a user`)
        }
    } catch (error) {
        response.status(404).send(`tournament ${request.params.id} not found`);
    }
});

// removing all participants from a tournament
tournamentRouter.delete("/clean/:id", isTournamentOwner, async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.id).exec();
        tournament.participants.push(request.body);
        const result = await tournament.save();
        response.send(result);
    } catch (error) {
        response.status(404).send(`tournament ${request.params.id} not found`);
    }
});

// Start a tournament, as a owner
tournamentRouter.patch("/start/:id", isTournamentOwner, async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.id).exec();
        if (tournament.participants.length < 2) { // constraint for number of participants
            response.status(400).send(`tournament ${request.params.id} must have at least 2 participants and an even number of participants to start`);
        }
        else {
            switch (tournament.status) {
                case TnStatus.notStarted:
                    tournament.status = TnStatus.ongoing;
                    tournament.save()
                    response.send({ result: tournament.status });
                    break
                case TnStatus.finished:
                    response.status(400).send(`tournament ${request.params.id} is already finished`);
                    break
                case TnStatus.ongoing:
                    response.status(400).send(`tournament ${request.params.id} is already started`);
                    break
                default:
                    response.send(500).send(`can't start the tournament`);
                    break
            }
        }
    } catch (error) {
        console.log(error)
        response.status(500).send(`${error}`);
    }
});
//cancels a tournament
tournamentRouter.patch("/stop/:id", isTournamentOwner, async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.id).exec();
        if (tournament.status === TnStatus.ongoing) {
            tournament.status = TnStatus.notStarted;
            tournament.save()
            // deleting all current matches
            await MatchModel.deleteMany({ tournament_id: request.params.tnId }).exec();
            response.send({ result: tournament.status });
        }
        else {
            response.status(400).send(`tournament ${request.params.id} isn't ongoing`);

        }
    } catch (error) {
        response.status(500).send(`${error}`);
    }
});
//end a tournament
tournamentRouter.patch("/end/:tnId", isTournamentOwner, async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.tnId).exec();
        if (!tournament) response.status(404).send('no tournament found')
        const matches = await MatchModel.find({ tournament_id: request.params.tnId }).exec();
        console.log(matches[matches.length-1])
        if (tournament.status === TnStatus.ongoing && matches[matches.length - 1].matchState === 'finished') {
                tournament.status = TnStatus.finished;
                tournament.save();
            //update every users score
            const players = await UserModel.find({tournaments:{ $elemMatch: { tournament_id: tournament._id, name: tournament.name } }}).exec()
            const standingArray = await tournamentTree.getStanding(request, response);
            console.log(players)
            console.log(standingArray)
            for (let player of standingArray) {
                if (player.rank === 1) {
                    players.map((currentP) => { if (currentP._id == player.participant_id) currentP.overview.firstPlace++ })
                } else if (player.rank === 2) {
                    players.map((currentP) => { if (currentP._id == player.participant_id) currentP.overview.secondPlace++ })
                } else if (player.rank === 3) {
                    players.map((currentP) => { if (currentP._id == player.participant_id) currentP.overview.thirdPlace++ })
                } else if (player.rank <= 8) {
                    players.map((currentP) => { if (currentP._id == player.participant_id) currentP.overview.top8++ })
                }
                players.map((currentP) => { if (currentP._id == player.participant_id) currentP.overview.totalMatches+= player.matchesPlayed.length })
            }

            for(let player of players){
                player.save();
            }
            response.send({ result: tournament.status });
        }
        else {
            response.status(400).send(`tournament ${request.params.tnId} cannot be ended or is already ended`);

        }
    } catch (error) {
        response.status(500).send(`${error.message}`);
    }
});


// save new tournament seeding
tournamentRouter.patch("/seeding", isTournamentOwner, async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.body._id).exec();
        if (tournament.status !== TnStatus.notStarted) {
            response.status(400).send(`tournament status must be not started in order to change the seeding`);
        } else {

            if (_.isEqual(tournament.participants.map(participant => participant.username).sort(), request.body.participants.map(participant => participant.username).sort())) {
                tournament.participants = request.body.participants;
                tournament.save();
                response.send({ success: true })
            }
            else {
                console.log(_.isEqual(tournament.participants.map(participant => participant.username).sort, request.body.participants.map(participant => participant.username).sort))
                response.status(500).send(`something went wrong when trying to save the participant list`);

            }
        }
    } catch (error) {
        response.status(500).send(`${error}`);
    }
});

tournamentRouter.delete("/:id", isTournamentOwner, async (request, response) => {
    try {
        const result = await TournamentModel.deleteOne({ _id: request.params.id }).exec();
        response.send(result);
    } catch (error) {
        response.status(404).send(`tournament ${request.params.id}not found`);
    }
});
//DELETE ALL

tournamentRouter.delete("/", isAdmin, async (request, response) => {
    try {
        const result = await TournamentModel.deleteMany().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = tournamentRouter;
