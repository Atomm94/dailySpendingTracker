import express from 'express';
const user = express();
import * as controllers from './index';
import * as validation from './validation';

user.get('/log/getMyCategories', controllers.getUserCategories);
user.post('/register', validation.registerValidation, controllers.register);
user.post('/login', validation.loginValidation, controllers.login);
user.post('/log/addCategory',validation.categoryValidation, controllers.addCategory);
user.post('/log/createBudget', validation.budgetValidation, controllers.createBudget);

export default user;