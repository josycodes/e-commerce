import LoggerLib from "../libs/Logger.lib.js";
import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class AdminService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.USER
    }

    async createUser(options){
        return await this.dbInstance.create(this.table, options);
    }
}