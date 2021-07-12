import { Schema, model } from "mongoose";
import {statusBudget} from "../Helpers/constant";

const budgetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(statusBudget),
        required: true
    },
    member: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'transaction'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const budgetModel = model('budget', budgetSchema);

export default budgetModel;