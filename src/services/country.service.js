import LoggerLib from "../libs/Logger.lib.js";
import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class CountryService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.COUNTRIES
    }

    async getAllCountries(options){
        return await this.dbInstance.findAll(this.table, options);
    }
}