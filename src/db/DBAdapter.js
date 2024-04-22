import {db} from './connect.js';
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
            throw new ErrorLib('Error creating data ' + error.message);
        }
    }

    async createAndFetch(table, data = {}){
        try{
            LoggerLib.log('createAndFetch', { table, data });
            const [created] = await this.db(table).returning('id').insert(data);
            return await this.db(table).where({ id: created.id }).first();
        }
        catch (error) {
            throw new ErrorLib('Error creating and fetching data ' + error.message);
        }
    }

    async update(table, options = {}, data = {}){
        try{
            LoggerLib.log('update', { table, options, data });
            return await this.db(table).where(options).update(data);
        }
        catch (error) {
            throw new ErrorLib('Error updating data ' + error.message);
        }
    }

    async updateAndFetch(table, options, data){
        try{
            LoggerLib.log('updateAndFetch', { table, options, data });
            const [updated] = await this.db(table).where(options).returning('id').update(data);
            return await this.db(table).where({ id: updated.id }).first();
        }
        catch (error) {
            throw new ErrorLib('Error updating and fetching data ' + error.message);
        }
    }

    async updateFirstAndFetch(table, options = {}, data){
        try{
            LoggerLib.log('updateAndFetch', { table, options, data });
            const [updated] = await this.db(table).first().returning('id').update(data);
            return await this.db(table).where({ id: updated.id }).first();
        }
        catch (error) {
            throw new ErrorLib('Error updating and fetching data ' + error.message);
        }
    }

    async firstOrUpdate(table, data){
        try{
            LoggerLib.log('firstOrUpdate', { table, data });
            const first = await this.db(table).first();
            if(first){
                const [updated] = await this.db(table).returning('id').update(data);
                return await this.db(table).where({ id: updated.id }).first();
            }else{
                const [created] = await this.db(table).returning('id').insert(data);
                return await this.db(table).where({ id: created.id }).first();
            }
        }
        catch (error) {
            throw new ErrorLib('Error updating and fetching first data ' + error.message);
        }
    }

    async findOne(table, options){
        try{
            LoggerLib.log('find', {table, options});
            return await this.db(table).where(options).first();
        }
        catch (error) {
            throw new ErrorLib('Error finding data ' + error.message);
        }
    }

    async findAllLIKE(table, options) {
        try {
            LoggerLib.log('find', {table, options});
            return await this.db(table).whereILike(options.columnName, options.search);
        } catch (error) {
            throw new ErrorLib('Error finding LIKE data ' + error.message);
        }
    }

    async findAll(table, options = {}){
        try{
            LoggerLib.log('find', {table, options});
            return await this.db(table).where(options);
        }
        catch (error) {
            throw new ErrorLib('Error finding data ' + error.message);
        }
    }

    async groupByWithCount(table, columnName){
        try{
            LoggerLib.log('groupByWithCount', {table, columnName});
            return await this.db(table).select(columnName).count('*').groupBy(columnName);
        }
        catch (error) {
            throw new ErrorLib('Error groupByWithCount data ' + error.message);
        }
    }

    async findAndCount(table,options= {}){
        try{
            LoggerLib.log('findAndCount', {table, options});
            return await this.db(table).count('*').where(options);
        }
        catch (error) {
            throw new ErrorLib('Error finding and counting data ' + error.message);
        }
    }

    async groupBy(table,columnName, limit){
        try{
            LoggerLib.log('groupBy', {table, columnName, limit});
            return await this.db(table).select(columnName).groupBy(columnName).limit(limit);
        }
        catch (error) {
            throw new ErrorLib('Error finding and groupingBy data ' + error.message);
        }
    }

    async orderByRaw(table,columnName,rawQuery, limit){
        try{
            LoggerLib.log('orderByRaw', {table, columnName,rawQuery, limit});
            return await this.db(table).select(columnName).orderByRaw(columnName).limit(limit);
        }
        catch (error) {
            throw new ErrorLib('Error finding and orderByRaw data ' + error.message);
        }
    }

    async orderByFindOne(table,columnName,order, limit){
        try{
            LoggerLib.log('orderBy', {table, columnName,order, limit});
            return await this.db(table).select('*').orderBy(columnName, order).limit(limit);
        }
        catch (error) {
            throw new ErrorLib('Error finding and orderBy data ' + error.message);
        }
    }

    async findWhereIn(table, columnName, data= []){
        try{
            LoggerLib.log('findWhereIn', {table, columnName, data});
            return await this.db(table).whereIn(columnName,data);
        }
        catch (error) {
            throw new ErrorLib('Error finding data WhereIn ' + error.message);
        }
    }

    async findWhereRaw(table, query){
        try{
            LoggerLib.log('findWhereRaw', {table, query});
            return await this.db(table).whereRaw(query);
        }
        catch (error) {
            throw new ErrorLib('Error finding data findWhereRaw ' + error.message);
        }
    }

    async findWhereInOptions(table, columnName, data= [], options = {}){
        try{
            LoggerLib.log('findWhereInOptions', {table, columnName, data});
            return await this.db(table).whereIn(columnName,data).where(options);
        }
        catch (error) {
            throw new ErrorLib('Error finding data WhereIn Options ' + error.message);
        }
    }
    async findWhereInOptionsPaginate(table, columnName, data= [], options = {}, limit, page){
        try{
            LoggerLib.log('findWhereInOptionsPaginate', {table, columnName, data, limit, page});
            return {
                data: await this.db(table).whereIn(columnName,data).where(options).limit(limit).offset((page - 1) * limit),
                total: await this.db(table).whereIn(columnName,data).where(options).count()
            };
        }
        catch (error) {
            throw new ErrorLib('Error finding data findWhereInOptionsPaginate ' + error.message);
        }
    }

    async getTotalOfColumn(table, columnName, options) {
        try {
            LoggerLib.log('getTotalOfColumn', {table, columnName, options});
            const result = await this.db(table).sum(columnName).where(options);
            return result[Object.keys(result)[0]];
        } catch (error) {
            throw new ErrorLib('Error occurred while getting total: ' + error.message);
        }
    }

    async queryRaw(table, columnName, operator,value){
        try{
            LoggerLib.log('queryRaw', {table, columnName, operator, value});
            return await this.db(table).where(columnName, operator, value);
        }catch (error) {
            throw new ErrorLib('Error occurred while getting Raw Query: ' + error.message);
        }
    }

    async whereBetween(table, columnName,options){
        try{
            LoggerLib.log('whereBetween', {table, columnName, options});
            return await this.db(table).whereBetween(columnName,options);
        }catch (error) {
            throw new ErrorLib('Error occurred while getting whereBetween: ' + error.message);
        }
    }

    async distinctCrossJoinRaw(table, rawQuery, columnName1, columnName2){
        try{
            LoggerLib.log('distinctCrossJoinRaw', {table, rawQuery});
            return await this.db(table).joinRaw(rawQuery).distinct(columnName1, columnName2);
        }catch (error) {
            throw new ErrorLib('Error occurred while getting Distinct Cross Join Raw: ' + error.message);
        }
    }

    async delete(table, options){
        try{
            LoggerLib.log('delete', {table, options});
            return await this.db(table).where(options).del();
        }
        catch (error) {
            throw new ErrorLib('Error deleting data' + error.message);
        }
    }
}