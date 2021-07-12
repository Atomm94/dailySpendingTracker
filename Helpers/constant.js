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

const transactionRepeat = Object.freeze({
    ONE_TIME: 'one time',
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

export {
    error,
    statusTransaction,
    statusBudget,
    transactionRepeat,
    defaultCategories
}