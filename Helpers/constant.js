let error = {};

const statusTransaction = Object.freeze({
    INCOME: 'income',
    EXPENSE: 'expense',
    SAVINGS: 'savings'
})

const statusBudget = Object.freeze({
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
})

const statusTransactionType = Object.freeze({
    ONE_TIME: 'one time',
    REGULAR: 'regular'
})


export {
    error,
    statusTransaction,
    statusBudget,
    statusTransactionType
}