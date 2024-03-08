import { app } from './middleware/app.middleware.js';
import routes from './routes/index.route.js';
import { connectDB } from './db/connect.js';
import LoggerLib from './libs/Logger.lib.js';
import dotenv from 'dotenv';
import {AssertionError} from "assert";
import ResponseLib from "./libs/Response.lib.js";
import {CelebrateError} from "celebrate";
import ErrorLib from "./libs/Error.lib.js";
dotenv.config();

const port = process.env.PORT || 3000;

//routes
app.get('/', (req, res) => res.status(200).json({ message: 'OK!' }));
app.use('/api', routes);

app.use((req, res) => {
    return res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
    LoggerLib.error(err);
    let message = 'Server Error', statusCode = 500;
    if (err instanceof ErrorLib) {
        message = err.message;
        statusCode = err.code;
    } else if (err instanceof CelebrateError) {
        message = err.details.entries().next().value[1].details[0].message.replace(/["]+/g, '').replace(/_/g, ' ')
        statusCode = 400;
    } else if (err instanceof AssertionError) {
        message = err.message;
        statusCode = 400;
    }
    new ResponseLib(req, res).status(statusCode).json({ message, status: false });
});

const start = async () => {
    try{
        await connectDB();
        app.listen(port, LoggerLib.log(`${process.env.APP_NAME} Server running on ${port}, env ${process.env.NODE_ENV}`))
    } catch (e) {
        LoggerLib.error(e)
    }
}

start()
