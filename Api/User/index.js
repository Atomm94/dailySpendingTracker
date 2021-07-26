import {errorHandler, successHandler} from "../../Helpers/responseFunctions";
import {comparePassword, hashPassword} from "../../Helpers/passwordHash";
import userModel from "../../Models/User";
import jsonwebtoken from "jsonwebtoken";
import {error} from "../../Helpers/constant";
import {createJwtToken} from "../../Helpers/auth";
import categoryModel from "../../Models/Category";
import budgetModel from "../../Models/Budget";

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
        tok = {
            id: findUserByEmail._id,
            role: 'user'
        }
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

const addCategoryForMe = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;
        const findCategory = await categoryModel.findOne({name: name, user: res.user.data.id});
        if (findCategory) {
            error.message = 'this category already be in your list!';
            return errorHandler(res, error);
        }
        const createCategory = await categoryModel.create({
            user: res.user.data.id,
            name: name,
            parentCategory: parentCategory
        });
        await userModel.updateOne({_id: res.user.data.id}, {
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
        const findCategories = await userModel.findOne({_id: res.user.data.id})
            .select('categories')
            .populate('categories');
        res.message = "My all categories";
        return successHandler(res, findCategories);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const createBudget = async (req, res) => {
    try {
        const body = req.body;
        body.member = res.user.data.id;
        if (!body.startDate) {
            body.startDate = new Date().toLocaleDateString();
        }
        const createBudget = await budgetModel.create(body);
        await userModel.updateOne({_id: res.user.data.id}, {
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
    addCategoryForMe,
    getUserCategories,
    createBudget
}