import { app } from './middleware/app.middleware.js';
import routes from './routes/index.route.js';
import { connectDB } from './db/connect.js';
import LoggerLib from './libs/Logger.lib.js';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3000;

console.log(process.env.PG_HOST);
console.log(process.env.PG_DB);
console.log(process.env.PG_PASSWORD);
console.log(process.env.PG_PORT);
console.log(process.env.PG_USER);
console.log(process.env.PG_URL);

//routes
app.get('/', (req, res) => res.status(200).json({ message: 'OK!' }));
app.use('/api', routes);

app.use((req, res) => {
    return res.status(404).json({ message: 'Not Found' });
});

const start = async () => {
    try{
        await connectDB();
        app.listen(port,LoggerLib.log(`${process.env.APP_NAME} Server running on ${port}, env ${process.env.NODE_ENV}`))
    } catch (e) {
        LoggerLib.error(e)
    }
}

start()
