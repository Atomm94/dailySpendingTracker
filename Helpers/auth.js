import express from'express';
import jwt from'jsonwebtoken';
import config from '../config';
import {successHandler, errorHandler} from "./responseFunctions";
import userModel from "../Models/User";
import {error} from "./constant";
const token = express();

token.use('/', async (req, res, next) => {
    const jwtAuth = req.authorization || req.headers['authorization'];
    jwt.verify(jwtAuth, "dailyspendingtracker@6/2/2021", (err, user) => {
        if (err) {
            return errorHandler(res, err);
        }
        next()
    })
})

token.get('/getData', async (req,res) => {
    try {
        const token = req.authorization || req.headers['authorization'];
        const decodeToken = await jwt.decode(token);
        const findUser = await userModel.findOne({_id: decodeToken.data.id})
        if (!findUser) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        return successHandler(res, findUser);
    } catch (err) {
        return errorHandler(res, err);
    }
})

const createJwtToken = async (data, expire) => {
    let getToken = await jwt.sign({data: data}, "dailyspendingtracker@6/2/2021");
    if (expire) {
        getToken = await jwt.sign({data: data}, "dailyspendingtracker@6/2/2021", {
            expiresIn: expire
        });
    }
    return getToken;
}

export {
    token,
    createJwtToken
}
