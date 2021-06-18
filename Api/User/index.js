import {errorHandler, successHandler} from "../../Helpers/responseFunctions";
import {comparePassword, hashPassword} from "../../Helpers/passwordHash";
import userModel from "../../Models/User";
import jsonwebtoken from "jsonwebtoken";
import {error} from "../../Helpers/constant";
import {createJwtToken} from "../../Helpers/auth";
import budgetModel from "../../Models/Budget";
import categoryModel from "../../Models/Category";

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
        let sendObj = {};
        let tok = {};
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
        const body = req.body;
        const token = req.authorization || req.headers['authorization'];
        const decodeToken = await jsonwebtoken.decode(token);
        const findUser = await userModel.findOne({_id: decodeToken.data.id});
        if (!findUser) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        const findCategory = await categoryModel.findOne({name: body.name, user: decodeToken.data.id});
        if (findCategory) {
            error.message = 'this category already be in your list!';
            return errorHandler(res, error);
        }
        body.user = decodeToken.data.id;
        const createCategory = await categoryModel.create(body);
        await userModel.updateOne({_id: decodeToken.data.id}, {
            $push: {categories: createCategory._id}
        })
        res.message = 'You add new category to your list!';
        return successHandler(res, createCategory);
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

const createBudget = async (req, res) => {
    try {
        const body = req.body;
        const token = req.authorization || req.headers['authorization'];
        const decodeToken = await jsonwebtoken.decode(token);
        const findUser = await userModel.findOne({_id: decodeToken.data.id});
        if (!findUser) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        body.user = decodeToken.data.id;
        const createBudget = await budgetModel.create(body);
        await userModel.updateOne({_id: decodeToken.data.id}, {
            $set: {budget: createBudget._id}
        })
        res.message = 'Your budget is created!';
        return successHandler(res, createBudget);
    } catch (err) {
        return errorHandler(res, err);
    }
}

export {
    register,
    login,
    addCategory,
    getUserCategories,
    createBudget
}