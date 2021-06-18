import {Schema, model} from 'mongoose';
import {hashPassword} from "../Helpers/passwordHash";
import env from 'dotenv';
env.config();

const adminSchema = new Schema({
    fullName: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    supportMessages: [{
        type: Schema.Types.ObjectId,
        ref: 'support'
    }]
})

const adminModel = model('admin', adminSchema);

(async function () {
    let Password = await hashPassword(process.env.ADMIN_PASSWORD);
    let Email = process.env.ADMIN_EMAIL;
    const findSuperAdmin = await adminModel.findOne({email: Email});
    if (!findSuperAdmin) {
        const registerSuperAdmin = await new adminModel({
            email: Email,
            password: Password
        })

        await registerSuperAdmin.save((err) => {
            if (err) console.log(err);
            console.log('Admin registered successfully!');
        });
    }
    return;
})()

export default adminModel;
