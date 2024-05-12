import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();


import {connectDB} from './config/db';
import User from './models/User';

const app = express();
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 3000;

import router from './routes';

app.use('/', router);


connectDB()
    .then(() => console.log('Database connection successful'))
    .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1);
    });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})