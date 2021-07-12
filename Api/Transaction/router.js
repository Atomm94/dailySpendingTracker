import express from 'express';
const transaction = express();
import * as controllers from './index';
import * as validation from './validation';

transaction.post('/log/newTransaction', validation.transactionValidation, controllers.createNewTransaction);
transaction.post('/log/getTransactionsForDiagram', controllers.getTransactionsForDiagram);

export default transaction;