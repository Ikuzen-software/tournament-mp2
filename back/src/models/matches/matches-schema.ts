const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

export const MatchSchema = new mongoose.Schema({
    player1_id: { type: String },
    player2_id: { type: String },
    tournament_id: { type: String, required: true },
    matchState: { type: String, default: 'not started' },
    identifier: { type: String },
    winner_id: { type: String },
    loser_id: { type: String },
    score: { type: String, default: '0-0' },
},


    { collection: "matches" });

MatchSchema.plugin(mongoosePaginate);
