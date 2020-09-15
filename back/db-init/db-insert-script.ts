import { TournamentModel } from '../src/models/tournaments/tournament-model'
import { UserModel } from '../src/models/users/user-model'
import * as config from '../src/config';
import * as express from 'express';

let usersJson = require('./mockUsers.json')
let tournamentsJson = require('./mockTournaments.json')
const mongoose = require("mongoose")
mongoose.connect(config.uri, {useNewUrlParser:true});

const db = mongoose.connection
const app = express();
async function main(){
    await UserModel.deleteMany().exec();
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