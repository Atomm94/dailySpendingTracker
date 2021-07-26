import transactionModel from "../Models/Transaction";
import {statusTransaction, transactionProcess, transactionRepeat} from "../Helpers/constant";
import finishedModel from "../Models/finishedTransactions";
import Joi from "joi";
import fs from 'fs'
import budgetModel from "../Models/Budget";
import userModel from "../Models/User";
const cron = require('node-cron');


cron.schedule('40 16 26 7 *', async () => {
    let date = new Date().toLocaleDateString()
        let split = date.split('/')
        let num = +split[0] - 1
        split[0] = num.toString()
        date = split.join('/')

    const findTransactions = await transactionModel.find({
        date: date,
        transaction_process: transactionProcess.IN_PROCESS
    }).populate('budget').lean()

    if (findTransactions !== []) {
        let budgetDocs = [];
        let transactionDocs = [];
        let finishedTransactionDocs = [];
        let bulkOps = {};
        findTransactions.map(async item => {
                bulkOps = {
                    updateMany: {
                        filter: { date: date, transactionRepeat: transactionRepeat.ONE_TIME },
                        update: { $set: { transaction_process: transactionProcess.FINISH } }
                    },
                }
                transactionDocs.push(bulkOps);

                date = new Date().toLocaleDateString()
                bulkOps = {
                    updateMany: {
                        filter: { transactionRepeat: transactionRepeat.REGULAR},
                        update: { $set: { date: date } }
                    },
                }
                transactionDocs.push(bulkOps);

            date = new Date().toLocaleDateString()

            bulkOps = {
                insertOne: {
                    document: {
                        status: item.status,
                        amount: item.amount,
                        note: item.note,
                        user: item.user,
                        category: item.category,
                        finishedDate: date,
                        budget: item.budget,
                        transaction: item._id
                    }
                }
            }
            finishedTransactionDocs.push(bulkOps);

            if (item.status !== statusTransaction.INCOME) {
                item.amount = -item.amount;
            }
            item.budget.balance += item.amount;

            bulkOps = {
                updateOne: {
                    filter: { _id: item.budget._id },
                    update: { $set: { balance: item.budget.balance } }
                },
            }
            budgetDocs.push(bulkOps)

        })

        await transactionModel.bulkWrite(transactionDocs);
        await finishedModel.bulkWrite(finishedTransactionDocs);
        await budgetModel.bulkWrite(budgetDocs);

        console.log('transactions are updated!');
    }
});
