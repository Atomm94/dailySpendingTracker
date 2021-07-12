import transactionModel from "../Models/Transaction";
import {transactionRepeat} from "../Helpers/constant";
import finishedModel from "../Models/finishedTransactions";
const cron = require('node-cron');


cron.schedule('1 0 * * *', async () => {
    let date = new Date().toLocaleDateString()
    let split = date.split('/')
    let num = +split[0] - 1
    split[0] = num.toString()
    date = split.join('/')

    const findRegularTransactions = await transactionModel.find({
        date: date,
        transactionType: statusTransactionType.REGULAR
    }).populate('category')

    if (findRegularTransactions !== []) {
        findRegularTransactions.map(async item => {
            console.log(item)
            await finishedModel.create({
                    user: item.user,
                    transaction: item._id,
                    finishDate: new Date().toLocaleDateString(),
                    amount: item.amount,
                    status: item.category.status
            })
        })
    }
    await transactionModel.updateMany({
        date: date,
        transactionRepeat: transactionRepeat.REGULAR
    }, {
        $set: {date: new Date().toLocaleDateString(), updatedAt: Date.now()}
    })
    console.log('transactions are updated!');
});


