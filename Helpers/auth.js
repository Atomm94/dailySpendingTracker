import express from'express';
import jwt from'jsonwebtoken';
import * as config from '../config';
import {successHandler, errorHandler, errorHandlerAuth} from "./responseFunctions";
import userModel from "../Models/User";
import jsonwebtoken from "jsonwebtoken";
import {error} from "./constant";
const tokenAdmin = express();
const tokenUser = express();

tokenAdmin.use('/', async (req, res, next) => {
    const jwtAuth = req.authorization || req.headers['authorization'];
    jwt.verify(jwtAuth, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
            return errorHandler(res, err);
        }
        res.user = await jsonwebtoken.decode(jwtAuth);
        let role = res.user.data.role;
        if (role !== 'admin'){
            error.message = 'admin is not find!';
            return errorHandlerAuth(res, error)
        }
        next()
    })
})

tokenUser.use('/', async (req, res, next) => {
    const jwtAuth = req.authorization || req.headers['authorization'];
    jwt.verify(jwtAuth, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
            return errorHandler(res, err);
        }
        res.user = await jsonwebtoken.decode(jwtAuth);
        let role = res.user.data.role;
        if (role !== 'user'){
            error.message = 'user is not find!';
            return errorHandlerAuth(res, error)
        }
        next()
    })
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
    tokenAdmin,
    tokenUser,
    createJwtToken
}
