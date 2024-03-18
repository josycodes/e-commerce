import knex from "knex";
import knexFile from "./knexfile.js";
import LoggerLib from '../libs/Logger.lib.js';
import { config } from 'dotenv';
config();

export const db = knex(knexFile[process.env.NODE_ENV]);

export const connectDB = () => {

    // Try to establish the connection
    return db.raw('SELECT 1+1 as result')
        .then(() => {
            LoggerLib.log('Database connection successful');
        })
        .catch((error) => {
            LoggerLib.error('Unable to connect to the database:', error);
        });
};
