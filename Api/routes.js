import { Router } from 'express';
import user from "./User/router";

const route = Router();

route.use('/user', user);

export default route;