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
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'category'
    }],
    budget: {
        type: Schema.Types.ObjectId,
        ref: 'budget'
    }
})

const userModel = model('user', userSchema);

export default userModel;