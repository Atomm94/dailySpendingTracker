import { Schema, model } from "mongoose";
import {statusTransaction, transactionProcess, transactionRepeat} from "../Helpers/constant";

const transactionSchema = new Schema({
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
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(statusTransaction),
        default: statusTransaction.EXPENSE
    },
    transactionRepeat: {
        type: String,
        enum: Object.values(transactionRepeat),
        default: transactionRepeat.ONE_TIME
    },
    transaction_process: {
        type: String,
        enum: Object.values(transactionProcess),
        default: transactionProcess.IN_PROCESS
    },
    note: String,
    budget: {
        type: Schema.Types.ObjectId,
        ref: 'budget'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: Date
})

const transactionModel = model('transaction', transactionSchema);

export default transactionModel;