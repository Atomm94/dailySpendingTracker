let error = {};

const statusTransaction = Object.freeze({
    INCOME: 'income',
    EXPENSE: 'expense',
    SAVINGS: 'savings'
})

const transactionRepeat = Object.freeze({
    ONE_TIME: 'one_time',
    REGULAR: 'regular'
})

const defaultCategories = Object.freeze({
    OTHER: 'other',
    ENTERTAINMENT: 'entertainment',
    FOOD_AND_DRINK: 'food_and_drink',
    HOUSING: 'housing',
    INCOME: 'income',
    LIFESTYLE: 'lifestyle',
    SAVINGS: 'savings',
    TRANSPORTATION: 'transportation'
})

const transactionProcess = Object.freeze({
    FINISH: 'finish',
    IN_PROCESS: 'in_process'
})

export {
    error,
    statusTransaction,
    transactionRepeat,
    defaultCategories,
    transactionProcess
}

