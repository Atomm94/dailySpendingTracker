import Joi from 'joi';
import {statusTransaction} from "../../Helpers/constant";
const validator = require('express-joi-validation').createValidator({})

const loginSchema = Joi.object({
    email: Joi.string().email().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).required(),
    password: Joi.string().required()
});


const loginValidation = validator.body(loginSchema);

export {
    loginValidation
}