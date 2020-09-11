import {UserModel} from '../../models/users/user-model'
import {jwtMW, isAdmin} from '../../auth'
const exjwt = require('express-jwt');

const express = require('express');
const cors = require('cors')
const userRouter = express.Router();
userRouter.use(cors({origin: 'http://localhost:4200'}))
userRouter.use(jwtMW)
//UPDATE by id

userRouter.put("/:id", async (request, response) => {
    try {
        const user = await UserModel.findById(request.params._id).exec();
        user.set(request.body);
        const result = await user.save();
        response.send(result);
    } catch (error) {
        response.status(404).send(`user ${request.params.id}not found`);
    }
});
//DELETE by id

userRouter.delete("/:id",isAdmin, 
    async (request, response) => {
    try {
        const result = await UserModel.deleteOne({ _id: request.params.id }).exec();
        response.send(result);
    } catch (error) {
        response.status(404).send(`tournament ${request.params.id}not found`);
    }
});
//DELETE ALL
userRouter.delete("/", isAdmin, async (request, response) => {
    try {
        const result = await UserModel.deleteMany().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = userRouter;
