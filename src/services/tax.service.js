import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";

export default class TaxService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.TAXES;
    }

    async createTax(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async searchTax(options){
        return await this.dbInstance.findAllLIKE(this.table, options);
    }

    async findAllTaxes(options){
        return await this.dbInstance.findAll(this.table, options);
    }
}