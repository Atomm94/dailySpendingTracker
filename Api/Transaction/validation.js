import Joi from 'joi';
import {statusTransaction, statusTransactionType} from "../../Helpers/constant";
const validator = require('express-joi-validation').createValidator({})

const transactionSchema = Joi.object({
    date: Joi.string().regex(/^([1-9]|1[012])[\/\-]([1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/),
    amount: Joi.number().required(),
    category: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/).required(),
    transactionType: Joi.string().valid(...Object.values(statusTransactionType)),
    photo: Joi.string(),
    description: Joi.string(),
    note: Joi.string()
})

const transactionValidation = validator.body(transactionSchema);

export {
    transactionValidation
}