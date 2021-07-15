import transactionModel from "../Models/Transaction";
import {transactionProcess, transactionRepeat} from "../Helpers/constant";
import finishedModel from "../Models/finishedTransactions";
const cron = require('node-cron');


cron.schedule('4 12 14 7 *', async () => {
    let date = new Date().toLocaleDateString()

    const findOneTimeTransactions = await transactionModel.find({
        date: date,
        transactionRepeat: transactionRepeat.ONE_TIME
    }).populate('category')

    if (findOneTimeTransactions !== []) {
        findOneTimeTransactions.map(async item => {
            await finishedModel.create({
                user: item.user,
                transaction: item._id,
                budget: item.budget,
                category: item.category,
                finishedDate: date,
                amount: item.amount,
                status: item.status,
                note: item.note,
                createdAt: Date.now()
            })
        })
    }
    const updateOneTimeTransactions = await transactionModel.updateMany({
        date: date,
        transactionRepeat: transactionRepeat.ONE_TIME
    }, {
        $set: {transaction_process: transactionProcess.FINISH, updatedAt: Date.now()}
    })

    let split = date.split('/')
    let num = +split[0] - 1
    split[0] = num.toString()
    date = split.join('/')

    const findRegularTransactions = await transactionModel.find({
        date: date,
        transactionRepeat: transactionRepeat.REGULAR
    }).populate('category')

    let finishedDate = new Date().toLocaleDateString();

    if (findRegularTransactions !== []) {
        findRegularTransactions.map(async item => {
            await finishedModel.create({
                    user: item.user,
                    transaction: item._id,
                    budget: item.budget,
                    category: item.category,
                    finishedDate: finishedDate,
                    amount: item.amount,
                    status: item.status,
                    note: item.note,
                    createdAt: Date.now()
            })
        })
    }
    await transactionModel.updateMany({
        date: date,
        transactionRepeat: transactionRepeat.REGULAR
    }, {
        $set: {date: finishedDate, updatedAt: Date.now()}
    })
    console.log('transactions are updated!');
});


