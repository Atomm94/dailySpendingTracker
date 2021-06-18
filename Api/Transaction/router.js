import express from 'express';
const transaction = express();
import * as controllers from './index';
import * as validation from './validation';

transaction.post('/log/newTransaction', validation.transactionValidation, controllers.createNewTransaction);

export default transaction;