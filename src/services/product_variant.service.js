import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";

export default class ProductVariantService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.PRODUCT_VARIANT
    }

    async createProductVariant(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async findProductVariant(options){
        return await this.dbInstance.findOne(this.table, options);
    }

    async updateProductVariant(options, data){
        return await this.dbInstance.update(this.table, options, data);
    }

    async findVariants(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async getDistinctVariantsRawQuery(rawQuery, columnName1, columnName2){
        return this.dbInstance.distinctCrossJoinRaw(this.table, rawQuery, columnName1, columnName2);
    }

    async getTotalStock(column_name, options){
        return this.dbInstance.getTotalOfColumn(this.table,column_name, options);
    }

    async filterQuery(options){
        const results = [];

        if (options.max_price !== undefined) {
            const query1 = await this.dbInstance.queryRaw(this.table, 'sale_price', '<', options.max_price);
            results.push(query1);
        }

        if (options.min_price !== undefined) {
            const query2 = await this.dbInstance.queryRaw(this.table,'sale_price', '>', options.min_price);
            results.push(query2);
        }

        // Execute all queries concurrently
        const mergedResults = await Promise.all(results);

        // Merge the results
        return mergedResults.reduce((acc, result) => {
            return acc.concat(result);
        }, []);
    }
}