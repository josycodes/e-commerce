import { db } from './connect.js';
import ErrorLib from '../libs/Error.lib.js';
import LoggerLib from "../libs/Logger.lib.js";

export default class DBAdapter {
    constructor() {
        this.db = db;
    }

    async create(table, data = {}){
        try{
            LoggerLib.log('create', { table, data });
            return await this.db(table).insert(data);
        }
        catch (error) {
            throw new ErrorLib('Error creating data' + error.message);
        }
    }

    async createAndFetch(table, data = {}){
        try{
            LoggerLib.log('createAndFetch', { table, data });
            const [created] = await this.db(table).returning('id').insert(data);
            return await this.db(table).where({ id: created.id }).first();
        }
        catch (error) {
            throw new ErrorLib('Error creating and fetching data' + error.message);
        }
    }

    async update(table, options = {}, data = {}){
        try{
            LoggerLib.log('update', { table, options, data });
            return await this.db(table).where(options).update(data);
        }
        catch (error) {
            throw new ErrorLib('Error updating data' + error.message);
        }
    }

    async updateAndFetch(table, options = {}, data = {}){
        try{
            LoggerLib.log('updateAndFetch', { table, options, data });
            const [updated] = await this.db(table).where(options).returning('id').update(data);
            return await this.db.where({ id: updated.id }).first();
        }
        catch (error) {
            throw new ErrorLib('Error updating and fetching data' + error.message);
        }
    }

    async findOne(table, options = {}){
        try{
            LoggerLib.log('find', {table, options});
            return await this.db(table).where(options).first();
        }
        catch (error) {
            throw new ErrorLib('Error finding data' + error.message);
        }
    }

    async findAll(table, options = {}){
        try{
            LoggerLib.log('find', {table, options});
            return await this.db(table).where(options);
        }
        catch (error) {
            throw new ErrorLib('Error finding data' + error.message);
        }
    }
}