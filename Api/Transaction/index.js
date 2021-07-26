import {errorHandler, successHandler} from "../../Helpers/responseFunctions";
import jsonwebtoken from "jsonwebtoken";
import userModel from "../../Models/User";
import {error, statusTransaction, transactionProcess, transactionRepeat} from "../../Helpers/constant";
import transactionModel from "../../Models/Transaction";
import categoryModel from "../../Models/Category";
import budgetModel from "../../Models/Budget";
import finishedModel from "../../Models/finishedTransactions";

const createNewTransaction = async (req, res) => {
    try {
        let balance, finishedTransaction;
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
        balance = findUserBudget.budget.balance;
        if (!body.date) {
            body.date = new Date().toLocaleDateString()
        }
        if (body.date === new Date().toLocaleDateString()) {
            if (body.status !== statusTransaction.INCOME) {
                body.amount = -body.amount;
            }
            balance = findUserBudget.budget.balance + body.amount;
            if (body.transactionRepeat === transactionRepeat.ONE_TIME) {
                body.transaction_process = transactionProcess.FINISH
                body.finishedDate = new Date().toLocaleDateString();
                finishedTransaction = await finishedModel.create(body);
            } else {
                body.finishedDate = new Date().toLocaleDateString();
                finishedTransaction = await finishedModel.create(body);
            }
        }
        const createTransaction = await transactionModel.create(body);
        if (finishedTransaction) {
            finishedTransaction.transaction = createTransaction._id;
            await finishedTransaction.save();
        }
        res.message = 'You are created new transaction';
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
        const status = req.query;
        const findUser = await userModel.findOne({_id: res.user.data.id});
        if (!findUser) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        const getExpenseTransactions = await transactionModel.find({status: status, user: res.user.data.id}).select('amount').lean();
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