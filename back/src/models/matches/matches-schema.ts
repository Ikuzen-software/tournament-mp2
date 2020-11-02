import {STATUS} from '../matches/match-status.enum'
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

export const MatchSchema = new mongoose.Schema({
    player1_id: { type: String, default: null },
    player2_id: { type: String, default: null },
    tournament_id: { type: String, required: true },
    matchState: { type: String, default: STATUS.notStarted },
    identifier: { type: String, required: true },
    winner_id: { type: String, default: null },
    loser_id: { type: String, default: null },
    score: { type: String, default: '0-0' },
},


    { collection: "matches" });

MatchSchema.plugin(mongoosePaginate);
