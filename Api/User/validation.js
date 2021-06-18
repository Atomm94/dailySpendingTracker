import Joi from 'joi';
import {statusBudget} from "../../Helpers/constant";
const validator = require('express-joi-validation').createValidator({})

const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).required(),
    password: Joi.string().required().min(3).max(15).trim()
})

const loginSchema = Joi.object({
    email: Joi.string().email().regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).required(),
    password: Joi.string().required().min(3).max(15).trim()
})

const budgetSchema = Joi.object({
    name: Joi.string(),
    status: Joi.string().valid(...Object.values(statusBudget)),
    currency: Joi.string().required(),
    balance: Joi.number().required()
})

const categorySchema = Joi.object({
    name: Joi.string().required(),
    status: Joi.string()
})


const registerValidation = validator.body(registerSchema);
const loginValidation = validator.body(loginSchema);
const budgetValidation = validator.body(budgetSchema);
const categoryValidation = validator.body(categorySchema);

export {
    registerValidation,
    loginValidation,
    budgetValidation,
    categoryValidation
}