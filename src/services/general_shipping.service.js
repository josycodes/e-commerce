import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";

export default class GeneralShippingService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.GENERAL_SHIPPING;
    }

    async updateShippingService(data){
        return await this.dbInstance.firstOrUpdate(this.table, data);
    }
}