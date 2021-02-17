import { TournamentModel } from '../src/models/tournaments/tournament-model'
import { UserModel } from '../src/models/users/user-model'
import {MatchModel} from '../src/models/matches/matches-model'
import * as config from '../src/config';

let usersJson = require('./mockUsers.json')
let tournamentsJson = require('./mockTournamentsLite.json')
const mongoose = require("mongoose")
mongoose.connect(config.uri, {useNewUrlParser:true});

const db = mongoose.connection

async function main(){
    db.dropCollection("users");
    db.dropCollection("tournaments");
    await UserModel.deleteMany().exec();
    await MatchModel.deleteMany().exec();
    console.log("deleted users")
    await TournamentModel.deleteMany().exec();
    console.log("deleted tournaments")
    console.log("\n inserting documents...")
    for(let user of usersJson){
        console.log(user)
        await UserModel(user).save();
    }
    for(let tournament of tournamentsJson){
        console.log(tournament)
        await TournamentModel(tournament).save();
    }
    console.log("insert done")
    process.exit()
}
main(); 

