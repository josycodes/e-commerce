import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";
import ShippingLocationConditionService from "./shipping_location_condition.service.js";
import ShippingFlatRateConditionService from "./shipping_rate_condition.service.js";
import {SHIPPING_METHODS} from "../config/shipping_method.js";

export default class ShippingMethodService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.SHIPPING_METHODS;
        this.shippingLocationConditionService = new ShippingLocationConditionService();
        this.shippingFlatRateConditionService = new ShippingFlatRateConditionService();
    }

    async addShippingMethod(data){
        const method = await this.dbInstance.findOne(this.table, data);
        if(method){
            return method;
        }else{
            return await this.dbInstance.createAndFetch(this.table, data);
        }
    }

    async updateShippingMethod(options, data){
        return await this.dbInstance.updateAndFetch(this.table, options, data);
    }
    async deleteShippingMethod(options){
        return await this.dbInstance.delete(this.table, options);
    }

    async findShippingMethod(options){
        return await this.dbInstance.findOne(this.table, options);
    }

    async getShippingMethodConditions(method_type,options){
        if(method_type === SHIPPING_METHODS.LOCATION_BASED){
            return await this.shippingLocationConditionService.getShippingConditions(options);
        }else if(method_type === SHIPPING_METHODS.FLAT_RATE){
            return await this.shippingFlatRateConditionService.getShippingConditions(options);
        }
    }

    async deleteShippingMethodConditions(method_type,options){
        if(method_type === SHIPPING_METHODS.LOCATION_BASED){
            return await this.shippingLocationConditionService.deleteShippingConditions(options);
        }else if(method_type === SHIPPING_METHODS.FLAT_RATE){
            return await this.shippingFlatRateConditionService.deleteShippingConditions(options);
        }
    }

    async getShippingMethods(options){
        return await this.dbInstance.findAll(this.table, options);
    }
}