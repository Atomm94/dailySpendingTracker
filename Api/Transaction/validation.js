import Joi from 'joi';
import {statusTransaction, transactionRepeat} from "../../Helpers/constant";
import {Schema} from "mongoose";
const validator = require('express-joi-validation').createValidator({})

const transactionSchema = Joi.object({
    date: Joi.string().regex(/^([1-9]|1[012])[\/\-]([1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/),
    amount: Joi.number().required(),
    transactionRepeat: Joi.string().valid(...Object.values(transactionRepeat)),
    status: Joi.string().valid(...Object.values(statusTransaction)),
    note: Joi.string()
})

const transactionValidation = validator.body(transactionSchema);

export {
    transactionValidation
}