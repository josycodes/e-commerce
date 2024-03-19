import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class ProductVariantService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.PRODUCT_VARIANT
    }

    async createProductVariant(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async findVariants(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async getTotalStock(column_name, options){
        return this.dbInstance.getTotalOfColumn(this.table,column_name, options);
    }
}