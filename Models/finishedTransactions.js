import { Schema, model } from "mongoose";
import {statusTransaction, transactionRepeat} from "../Helpers/constant";

const finishedTransactionsSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    status: {
        type: String,
        enum: Object.values(statusTransaction),
        default: statusTransaction.EXPENSE
    },
    note: String,
    budget: {
        type: Schema.Types.ObjectId,
        ref: 'budget'
    },
    finishedDate: {
        type: String,
        required: true
    },
    transaction: {
        type: Schema.Types.ObjectId,
        ref: 'transaction'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const finishedModel = model('finishedTransaction', finishedTransactionsSchema);

export default finishedModel;