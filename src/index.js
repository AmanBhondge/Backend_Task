import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { PORT } from './config/config.js';

import connectToDatabase from './utils/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js'

import authRouter from './routes/auth.route.js';
import taskRouter from './routes/task.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/task", taskRouter);


app.use(errorMiddleware);

app.listen(PORT, async () => {
    console.log(` API is running on http://localhost:${PORT}`);

    await connectToDatabase();
});

export default app; 