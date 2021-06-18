import { Schema, model } from 'mongoose';
import {statusTransactionType} from "../Helpers/constant";

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
        type: Schema.Types.ObjectId,
        ref: 'category'
    },
    budget: {
        type: Schema.Types.ObjectId,
        ref: 'budget'
    },
    transactionType: {
        type: String,
        enum: Object.values(statusTransactionType),
        default: statusTransactionType.ONE_TIME
    },
    photo: String,
    description: String,
    note: String,
    updatedAt: Date
})

const transactionModel = model('transaction', transactionSchema);

export default transactionModel;
