import express from 'express';
const user = express();
import * as controllers from './index';
import * as validation from './validation';

user.post('/register', validation.registerValidation, controllers.register);
user.post('/login', validation.loginValidation, controllers.login);

export default user;