import {UserModel} from '../../models/users/user-model'
const exjwt = require('express-jwt');
const Bcrypt = require("bcryptjs");
const express = require('express');
const cors = require('cors')
const userRouter = express.Router();
userRouter.use(cors({origin: 'http://localhost:4200'}))

//POST /users
userRouter.post("/",  async (request, response) => {
    try {
        const user = new UserModel(request.body);
        const result = await user.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

//GET all
userRouter.get("/", async (request, response) => {
    try {
        const users = await UserModel.find().select("-password");
        response.send(users);
    } catch (error) {
        console.log(error)
        response.status(404).send(error);
    }
});

//GET by id

userRouter.get("/:id", async (request, response) => {
    try {
        const user = await UserModel.findById(request.params.id).select("-password");
        response.send(user);
    } catch (error) {
        response.status(404).send(`user ${request.params.id}not found`);
    }
});


//GET by username
userRouter.get("/username/:username",  async (request, response) => {
    try {
        const user = await UserModel.find({ username: new RegExp(`^${request.params.username}$`) }).select("-password");
        response.send(user);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = userRouter;
