import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class ProductCollectionService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.PRODUCT_COLLECTION
    }

    async createProductCollection(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async findProductCollection(options){
        return await this.dbInstance.findAll(this.table, options);
    }
}