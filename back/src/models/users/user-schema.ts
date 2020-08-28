const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;
export const UserSchema = new mongoose.Schema({
    username: { type : String ,minlength: [4, 'username must be 4 characters minimum'], maxlength: 12, unique : true },
    email:  { type: String , required : true},
    password: {type: String , required : true },
    birthdate: {type: Date , required : true },
    role:{type: String, default: 'user'},
    register_date: {type: Date, default: Date.now}
},
{collection:"user", selectPopulatedPaths: false });

UserSchema.index({username: 1}, {unique: true}); //unique name restriction
UserSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = Bcrypt.hashSync(this.password, 10);
    next();
});
UserSchema.plugin(mongoosePaginate)

