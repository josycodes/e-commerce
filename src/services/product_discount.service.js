import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";

export default class ProductDiscountService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.PRODUCT_DISCOUNT;
    }

    async createProductDiscounts(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async getAllProductDiscounts(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async getAllProductDiscount(options){
        return await this.dbInstance.findOne(this.table, options);
    }
}