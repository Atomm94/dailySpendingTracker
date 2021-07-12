import express from 'express';
const admin = express();
import * as controllers from './index';
import * as validation from './validation';

admin.post('/login', validation.loginValidation, controllers.login);

export default admin;