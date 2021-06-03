import {errorHandler, successHandler} from "../../Helpers/responseFunctions";
import jsonwebtoken from "jsonwebtoken";
import userModel from "../../Models/User";
import {error} from "../../Helpers/constant";
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
        body.user = decodeToken.data.id;
        const createTransaction = await transactionModel.create(body);
        res.message = 'You are created new transaction';
        return successHandler(res, createTransaction);
    } catch (err) {
        return errorHandler(res, err);
    }
}