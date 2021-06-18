import {Schema, model} from 'mongoose';
import {statusBudget} from "../Helpers/constant";

const budgetSchema = new Schema({
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'transaction'
    }],
    currency: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: Date
})

const budgetModel = model('budget', budgetSchema);

export default budgetModel;