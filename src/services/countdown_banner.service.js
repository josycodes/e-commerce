import LoggerLib from "../libs/Logger.lib.js";
import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class CountdownBannerService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.COUNTDOWN_BANNER
    }

    async findBanner(options){
        return await this.dbInstance.findOne(this.table, options);
    }
    async allBanners(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async updateBanner(data){
        return await this.dbInstance.updateFirstAndFetch(this.table,{}, data);
    }
}