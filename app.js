import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as config from './config';
import route from "./Api/routes";
import {token} from "./Helpers/auth";
import * as cron from './Watch/cronWatching';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/user/log', token);
app.use('/api/admin/log', token);
app.use('/api/transaction/log', token);
app.use('/api', route);

app.listen(port, () => {
    console.log(`Server started with port ${port}`);
})

