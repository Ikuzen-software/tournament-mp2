import {MatchSchema} from './matches-schema'

const mongoose = require('mongoose');
export const TournamentModel = mongoose.model("Match",MatchSchema, 'matches')
