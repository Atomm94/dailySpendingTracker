import {Schema, model} from 'mongoose';
import {statusTransaction} from "../Helpers/constant";

const finishedTransactionsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    amount: {
        type: Number,
        required: true
    },
    transaction: {
        type: Schema.Types.ObjectId,
        ref: 'transaction'
    },
    finishDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(statusTransaction),
        default: statusTransaction.EXPENSE
    }
})

const finishedModel = model('finishedTransactions', finishedTransactionsSchema);

export default finishedModel;