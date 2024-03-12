import LoggerLib from "../libs/Logger.lib.js";
import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class VariantService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.VARIANT
    }

    async createVariant(options){
        return await this.dbInstance.create(this.table, options);
    }

    async allVariants(options){
        return await this.dbInstance.findAll(this.table, options);
    }
}