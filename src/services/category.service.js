import LoggerLib from "../libs/Logger.lib.js";
import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class CategoryService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.CATEGORY
    }

    async createCategory(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async getAllCategories(options = {}){
        return await this.dbInstance.findAll(this.table, options);
    }

    async getCountCategories(options){
        return await this.dbInstance.findAndCount(this.table, options);
    }

    async findCategory(options){
        return await this.dbInstance.findOne(this.table, options);
    }

    async findCategoryWhereIn(columnName, data){
        return await this.dbInstance.findWhereIn(this.table, columnName, data);
    }

    async updateCategory(options, data){
        return await this.dbInstance.updateAndFetch(this.table, options, data);
    }

    async deleteCategory(options){
        return await this.dbInstance.delete(this.table, options);
    }
}