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
        let { month, year, status } = req.query;
        const findUser = await userModel.findOne({_id: res.user.data.id});
        if (!findUser) {
            error.message = 'User is not find!';
            return errorHandler(res, error);
        }
        month = new RegExp(`^${month}`);
        year = new RegExp(`${year}$`);
        const getTransactions = await transactionModel.aggregate([
                {
                    $match: {
                        $and: [ { date: month }, { date:  year }, {status: status}, {user: res.user.data.id}] // {user: res.user.data.id}
                    }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $unwind: '$category'
                },
                {
                    $group: {_id: {category: "$category.name", status: status}, transactions: {$sum: 1}, totalSum: {$sum: "$amount"}}
                },
            { $addFields: {
                    totalPrice: {
                        $sum: "$totalSum"
                    }
                } },
            ]);
        return successHandler(res, getTransactions);
    } catch (err) {
        return errorHandler(res, err);
    }
}

const getTransaction = async (req, res) => {
    try {
        const { transactionId } = req.query;
        const findTransactionById = await transactionModel.findOne({_id: transactionId, user: res.user.data.id});
        res.message = 'Your transaction!';
        return successHandler(res, findTransactionById);
    } catch (err) {
        return errorHandler(res, err);
    }
}

export {
    createNewTransaction,
    getTransactionsByDate,
    getTransaction
}