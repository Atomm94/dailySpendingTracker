import Joi from 'joi';
import {statusTransaction} from "../../Helpers/constant";
const validator = require('express-joi-validation').createValidator({})

const loginSchema = Joi.object({
    email: Joi.string().email().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).required(),
    password: Joi.string().required()
});

const defaultCategorySchema = Joi.object({
    name: Joi.string().required(),
    status: Joi.string().valid(...Object.values(statusTransaction)).required()
})

const loginValidation = validator.body(loginSchema);
const defaultValidation = validator.body(defaultCategorySchema);

export {
    loginValidation,
    defaultValidation
}