import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";

export default class PromotionService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.PROMOTIONS;
    }

    async createPromotion(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async updatePromotion(options){
        return await this.dbInstance.updateAndFetch(this.table, options);
    }

    async getPromotion(options){
        return await this.dbInstance.findOne(this.table, options);
    }
}