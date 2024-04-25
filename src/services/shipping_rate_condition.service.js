import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class ShippingFlatRateConditionService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.SHIPPING_FLAT_RATE_CONDITION;
    }

    async addShippingFlatRateCondition(options, data){
        const check_condition = await this.dbInstance.findOne(this.table, options);
        if(!check_condition){
            return await this.dbInstance.createAndFetch(this.table, data);
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