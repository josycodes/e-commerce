import LoggerLib from "../libs/Logger.lib.js";
import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class BannerService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.BANNER
    }

    async findBanner(options){
        return await this.dbInstance.findOne(this.table, options);
    }

    async updateBanner(options, data){
        return await this.dbInstance.updateAndFetch(this.table,options, data);
    }

    async allBanners(options){
        return await this.dbInstance.findAll(this.table);
    }


}