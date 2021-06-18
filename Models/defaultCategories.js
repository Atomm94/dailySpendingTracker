import {Schema, model} from 'mongoose';
import {statusTransaction} from "../Helpers/constant";

const defaultCategoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(statusTransaction),
        default: statusTransaction.EXPENSE
    }
})

const defaultModel = model('defaultCategory', defaultCategoriesSchema);

export default defaultModel;