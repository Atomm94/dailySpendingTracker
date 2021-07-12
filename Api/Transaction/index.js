import {errorHandler, successHandler} from "../../Helpers/responseFunctions";
import jsonwebtoken from "jsonwebtoken";
import userModel from "../../Models/User";
import {error, statusTransaction, transactionRepeat} from "../../Helpers/constant";
import transactionModel from "../../Models/Transaction";
import categoryModel from "../../Models/Category";
import budgetModel from "../../Models/Budget";
import finishedModel from "../../Models/finishedTransactions";

const createNewTransaction = async (req, res) => {
    try {
        const body = req.body;
        const { categoryId } = req.query;
        const findUserBudget = await userModel.findOne({_id: res.user.data.id})
            .select('budget')
            .populate('budget');
        if (!findUserBudget) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        const findCategory = await categoryModel.findOne({_id: categoryId});
        if (!findCategory) {
            error.message = 'Category is not find on your categories list!';
            return errorHandler(res, error);
        }
        body.budget = findUserBudget.budget._id;
        body.user = res.user.data.id;
        body.category = categoryId;
        if (!body.date || body.date === new Date().toLocaleDateString()) {
            body.date = new Date().toLocaleDateString()
            body.transaction_finished = true;
            body.finishedDate = new Date().toLocaleDateString();
            await finishedModel.create(body);
        }
        const createTransaction = await transactionModel.create(body);
        if (body.status !== statusTransaction.INCOME) {
            body.amount = -body.amount;
        }
        res.message = 'You are created new transaction';
        let balance = findUserBudget.budget.balance + body.amount;
        await budgetModel.updateOne({member: res.user.data.id}, {
            $push: {transactions: createTransaction._id},
            $set: {balance: balance}
        })
        return successHandler(res, createTransaction);
    } catch (err) {
        return errorHandler(res, err);
    }
}


const getTransactionsByDate = async (req, res) => {
    try {
        const { date } = req.body;
        const findUser = await userModel.findOne({_id: res.user.data.id});
        if (!findUser) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        const getTransactions = await transactionModel.find({date: date});
        return successHandler(res, getTransactions);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const getTransactionsForDiagram = async (req, res) => {
    try {
        let sum;
        let arr = [];
        let obj = {};
        const findUser = await userModel.findOne({_id: res.user.data.id});
        if (!findUser) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        const getExpenseTransactions = await transactionModel.find({status: statusTransaction.EXPENSE, user: res.user.data.id}).select('amount');
        getExpenseTransactions.map(item => {
            sum += Number(item)
        })
        getExpenseTransactions.map(el => {
            obj = {
                transaction: el.id,
                price: el.amount,
                percent: el.amount/sum * 100
            }
            arr.push(obj)
        })
        return successHandler(res, arr);
    } catch (err) {
        return errorHandler(res, err);
    }
}

export {
    createNewTransaction,
    getTransactionsForDiagram
}