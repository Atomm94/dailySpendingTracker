import {Schema, model} from 'mongoose';
import {statusTransaction} from "../Helpers/constant";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(statusTransaction),
        default: statusTransaction.EXPENSE
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const categoryModel = model('category', categorySchema);

export default categoryModel;
