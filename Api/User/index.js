import {errorHandler, successHandler} from "../../Helpers/responseFunctions";
import {comparePassword, hashPassword} from "../../Helpers/passwordHash";
import userModel from "../../Models/User";
import jsonwebtoken from "jsonwebtoken";
import {error, sendObj, tok} from "../../Helpers/constant";
import {createJwtToken} from "../../Helpers/auth";

const register = async (req, res) => {
    try {
        const body = req.body;
        body.password = await hashPassword(body.password);
        const createNewUser = await userModel.create(body);
        res.message = 'User register successfully!';
        return successHandler(res, createNewUser);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUserByEmail = await userModel.findOne({email: email});
        if (!findUserByEmail) {
            error.message = 'User with this email is not find!';
            return errorHandler(res, error);
        }
        const compare = await comparePassword(password, findUserByEmail.password);
        if (!compare) {
            error.message = 'Password is not correct!';
            return errorHandler(res, error);
        }
        tok.id = findUserByEmail._id;
        let token = await createJwtToken(tok);
        sendObj = {
            Data: findUserByEmail,
            Token: token
        }
        res.message = 'User login successfully!';
        return successHandler(res, sendObj);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const addCategory = async (req, res) => {
    try {
        const { categoryName } = req.body;
        const token = req.authorization || req.headers['authorization'];
        const decodeToken = await jsonwebtoken.decode(token);
        const addFavouriteCategory = await userModel.updateOne({_id: decodeToken.data.id}, {
            $push: {category: categoryName}
        });
        if (addFavouriteCategory.nModified === 0) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        res.message = 'You add new category';
        const findUpdatedDoc = await userModel.findOne({_id: decodeToken.data.id})
            .select('categories')
            .populate('categories');
        return successHandler(res, findUpdatedDoc);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const getUserCategories = async (req, res) => {
    try {
        const token = req.authorization || req.headers['authorization'];
        const decodeToken = await jsonwebtoken.decode(token);
        const findCategories = await userModel.findOne({_id: decodeToken.data.id})
            .select('categories')
            .populate('categories');
        if (!findCategories) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        res.message = 'All categories this user';
        return successHandler(res, findCategories);
    } catch (err) {
        return errorHandler(res, err);
    }
}

export {
    register,
    login,
    addCategory,
    getUserCategories
}