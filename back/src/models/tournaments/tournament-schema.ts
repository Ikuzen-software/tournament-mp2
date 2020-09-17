const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;

export const TournamentSchema = new mongoose.Schema({
    name: { type : String , unique : true },
    size:  { type: Number ,required : true},
    createdAt: {type: Date, default: Date.now},
    description: {type: String, default: 'no description'},
    game: {type: String, default: 'NA'},
    format: {type: String},
    
    participants: [{
        username: {type: String
        },
        participant_id: {type: String
        },
    }],
    organizer: {
        username: {type: String, required: true},
        organizer_id: {type: String, required: true}
    },
    startDate:{type: Date},
    status:{type: String, default: 'not started'}},
    
    
    {collection:"tournaments"});
    
    TournamentSchema.index({name: 1}, {unique: true}); //unique name restriction
    TournamentSchema.plugin(mongoosePaginate);
