import { TournamentModel } from '../../models/tournaments/tournament-model'
import { jwtMW, isTournamentOwner, isAdmin, isLoggedIn, getUserFromToken } from '../../auth';
import { Tournament } from '../../models/tournaments/tournament-interface';
import { UserModel } from '../../models/users/user-model';

const express = require('express');
const tournamentRouter = express.Router();
const cors = require('cors')
tournamentRouter.use(cors({ origin: 'http://localhost:4200' }))
tournamentRouter.use(jwtMW);

tournamentRouter.post("/", isLoggedIn, async (request, response) => {
    try {
        let token = request.headers.authorization?.split(' ')[1];
        const user = getUserFromToken(token);
        if (request.body?.organizer?.username !== user.username && request.body?.organizer?.organizer_id !== user._id) {
            response.status(500).send('organizer must be the same as the tournament creator')
        }
        const tournament = new TournamentModel(request.body);
        const userModel = new UserModel(user)
        user.tournaments.push({tournament_id:tournament._id, name:tournament.name})
        const userResult = await userModel.save()
        const tournamentResult = await tournament.save();
        response.send(tournamentResult);
    } catch (error) {
        response.status(500).send(error);
    }
});
// full modification
tournamentRouter.put("/:id", isTournamentOwner, async (request, response) => {
    try {
        const tournament = await TournamentModel.findById(request.params.id).exec();
        tournament.set(request.body);
        const result = await tournament.save();
        response.send(result);
    } catch (error) {
        response.status(404).send(`tournament ${request.params.id} not found`);
    }
});
// joining a tournament
tournamentRouter.put("/join/:id", isLoggedIn, async (request, response) => {
    try {
        const user = request.body;
        if (user.username) {
            console.log(user)
            if (getUserFromToken(request.headers.authorization?.split(' ')[1]).username !== user.username) {
                response.status(401).send(`participant ${user.username} is not the authentified user`);
            }else{
                const tournament = await TournamentModel.findById(request.params.id).exec();
                if(tournament.participants.length >= tournament.size){
                    response.status(401).send('tournament is full')
                }else{
                    if (tournament.participants.filter(participant => participant.username === user.username).length > 0) {
                        response.status(401).send(`participant ${user.username} has already joined the tournament`);
                    }
                    else { //When success
                        tournament.participants.push({participant_id: user.id, username: user.username});
                        const tournamentResult = await tournament.save({upsert:true});
                        const participant = await UserModel.findById(user.id).exec();
                        if(tournamentResult?.organizer?.username === participant.username){ // case participant is also owner
                            participant.overview.totalOrganized++;
                        }else{ // case not owner
                            participant.tournaments.push({name:tournament.name, tournament_id: tournament._id});
                            participant.overview.totalParticipated++;
                        }
                        const participantResult = await participant.save({upsert:true});
                        response.send(tournamentResult);
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
            }else{
                let tournament = await TournamentModel.findById(request.params.id).exec();
                tournament.participants = tournament.participants.filter(participant => participant.username !== user.username)
                let participant = await UserModel.findById(user.id).exec();
                if(participant.username === tournament?.organizer?.username){// if owner
                    participant.overview.totalParticipated--;
                } else{
                    participant.tournaments = participant.tournaments.filter(_tournament => tournament.name === _tournament.name && tournament._id === _tournament.tournament_id);
                    participant.overview.totalParticipated--;
                }
                const tournamentResult = await tournament.save()
                const userResult = await participant.save()
                response.send(tournamentResult)
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
        response.status(404).send(`tournament ${request.params.id}not found`);
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
