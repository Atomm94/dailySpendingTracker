import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    categories: [String],
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'transaction'
    }]
})

const userModel = model('user', userSchema);

export default userModel;