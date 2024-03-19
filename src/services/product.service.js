import LoggerLib from "../libs/Logger.lib.js";
import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class ProductService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.PRODUCT
    }

    async createProduct(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async findProduct(options){
        return await this.dbInstance.findOne(this.table,options);
    }

    async findAll(options){
        return await this.dbInstance.findAll(this.table, options);
    }
}