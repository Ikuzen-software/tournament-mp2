
import { TournamentSchema } from '../tournaments/tournament-schema';
import { defaultOverview } from './user-interface';
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;
export const UserOverviewSchema = new mongoose.Schema({
    firstPlace: {type: Number, default: 0},
    secondPlace: {type: Number, default: 0},
    thirdPlace: {type: Number, default: 0},
    top8: {type: Number, default: 0},
    totalMatches: {type: Number, default: 0},
    totalParticipated: {type: Number, default: 0},
    totalOrganized: {type: Number, default: 0},
},{ _id : false });

export const UserSchema = new mongoose.Schema({
    username: { type : String ,minlength: [4, 'username must be 4 characters minimum'], maxlength: 12, unique : true },
    email:  { type: String , required : true},
    password: {type: String , required : true },
    birthdate: {type: Date , required : true },
    role:{type: String, default: 'user'},
    register_date: {type: Date, default: Date.now},
    tournaments: [{
        name: {type: String
        },
        tournament_id: {type: String
        },
        _id:false,
    },
    ],
    overview: {type: UserOverviewSchema, default:defaultOverview}
},
{collection:"user", selectPopulatedPaths: false });

UserSchema.index({username: 1}, {unique:true}); //unique name restriction
UserSchema.pre("save", function(next) {
    if(!this.isModified("password")) { // password hash
        return next();
    }
    this.password = Bcrypt.hashSync(this.password, 10);
    next();
});
UserSchema.plugin(mongoosePaginate) // pagination activation

