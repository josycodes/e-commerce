import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class ShippingLocationConditionService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.SHIPPING_LOCATION_CONDITION;
    }

    async addShippingLocationCondition(options){
        const check_condition = await this.dbInstance.findOne(this.table, options);
        if(!check_condition){
            return await this.dbInstance.createAndFetch(this.table, options);
        }else{
            return check_condition;
        }
    }

    async getShippingConditions(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async deleteShippingConditions(options){
        return await this.dbInstance.delete(this.table, options);
    }
}