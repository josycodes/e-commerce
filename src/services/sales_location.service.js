import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";

export default class SalesLocationService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.SALES_LOCATION;
    }

    async createSalesLocation(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }
}