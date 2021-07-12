import { Schema, model } from "mongoose";
import {defaultCategories} from "../Helpers/constant";

const categorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    parentCategory: {
        type: String,
        enum: Object.values(defaultCategories),
        required: true
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

const categoryModel = model('category', categorySchema);

export default categoryModel;