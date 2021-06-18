import {errorHandler, successHandler} from "../../Helpers/responseFunctions";
import jsonwebtoken from "jsonwebtoken";
import userModel from "../../Models/User";
import {error, statusTransactionType} from "../../Helpers/constant";
import transactionModel from "../../Models/Transaction";

const createNewTransaction = async (req, res) => {
    try {
        const body = req.body;
        const token = req.authorization || req.headers['authorization'];
        const decodeToken = await jsonwebtoken.decode(token);
        const findUser = await userModel.findOne({_id: decodeToken.data.id});
        if (!findUser) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        if (!body.date) {
            body.date = new Date().toLocaleDateString()
        }
        body.budget = findUser.budget;
        body.user = decodeToken.data.id;
        const createTransaction = await transactionModel.create(body);
        res.message = 'You are created new transaction';
        return successHandler(res, createTransaction);
    } catch (err) {
        return errorHandler(res, err);
    }
}


const getTransactionsByDate = async (req, res) => {
    try {
        const { date } = req.body;
        const token = req.authorization || req.headers['authorization'];
        const decodeToken = await jsonwebtoken.decode(token);
        const findUser = await userModel.findOne({_id: decodeToken.data.id});
        if (!findUser) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        const getTransactions = await transactionModel.find({date: date});

    } catch (err) {
        return errorHandler(res, err);
    }
}

export {
    createNewTransaction
}