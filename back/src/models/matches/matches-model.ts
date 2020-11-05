import {MatchSchema} from './matches-schema'

const mongoose = require('mongoose');
export const MatchModel = mongoose.model("Match",MatchSchema, 'matches')
