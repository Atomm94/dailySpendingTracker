import { Schema, model } from 'mongoose';
import {statusTransaction} from "../Helpers/constant";

const transactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(statusTransaction),
        default: statusTransaction.EXPENSE
    },
    photo: String,
    description: String,
    note: String
})

const transactionModel = model('transaction', transactionSchema);

export default transactionModel;
