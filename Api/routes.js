import { Router } from 'express';
import user from "./User/router";
import transaction from "./Transaction/router";
import admin from "./Admin/router";

const route = Router();

route.use('/user', user);
route.use('/admin', admin);
route.use('/transaction', transaction);

export default route;