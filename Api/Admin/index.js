import {successHandler, errorHandler} from "../../Helpers/responseFunctions";
import adminModel from "../../Models/Admin";
import {error} from "../../Helpers/constant";
import jsonwebtoken from "jsonwebtoken";
import {comparePassword} from "../../Helpers/passwordHash";
import {createJwtToken} from "../../Helpers/auth";

const login = async (req, res) => {
    try {
        let tok, sendObj = {};
        const { email, password } = req.body;
        const findSuperAdmin = await adminModel.findOne({email: email});
        if (!findSuperAdmin) {
            error.message = 'Admin is not find!';
            return errorHandler(res, error);
        }
        const compare = await comparePassword(password, findSuperAdmin.password);
        if (!compare) {
            error.message = 'Password is not correct!';
            return errorHandler(res, error);
        }
        tok = {
            id: findSuperAdmin._id,
            role: 'admin'
        }
        const token = await createJwtToken(tok);
        sendObj = {
            Data: findSuperAdmin,
            Token: token
        }
        return successHandler(res, sendObj);
    } catch (err) {
        return errorHandler(res, err);
    }
}

export {
    login
}