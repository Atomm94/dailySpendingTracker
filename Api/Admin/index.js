import {successHandler, errorHandler} from "../../Helpers/responseFunctions";
import adminModel from "../../Models/Admin";
import {error} from "../../Helpers/constant";
import jsonwebtoken from "jsonwebtoken";
import {comparePassword} from "../../Helpers/passwordHash";
import {createJwtToken} from "../../Helpers/auth";
import defaultModel from "../../Models/defaultCategories";

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
            id: findSuperAdmin._id
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

const addDefaultCategory = async (req, res) => {
    try {
        const body = req.body;
        const token = req.authorization || req.headers['authorization'];
        const decodeToken = await jsonwebtoken.decode(token);
        const findAdmin = await adminModel.findOne({_id: decodeToken.data.id});
        if (!findAdmin) {
            error.message = 'Admin is not find!';
            return errorHandler(res, error);
        }
        res.message = 'You add new default category!';
        const createDefaultCategory = await defaultModel.create(body);
        return successHandler(res, createDefaultCategory);
    } catch (err) {
        return errorHandler(res, err);
    }
}

export {
    login,
    addDefaultCategory
}