import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";

export default class ShippingAddressService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.SHIPPING_ADDRESS;
    }

    async createShippingAddress(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async getShippingAddress(options){
        return await this.dbInstance.findOne(this.table, options);
    }
}