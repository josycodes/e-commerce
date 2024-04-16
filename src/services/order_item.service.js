import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";

export default class OrderItemService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.ORDER_ITEM;
    }

    async getOrderItems(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async getProductOrderGroupBy(columnName, limit){
        return this.dbInstance.groupBy(this.table,columnName, limit);
    }
}