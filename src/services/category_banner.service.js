import LoggerLib from "../libs/Logger.lib.js";
import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class CategoryBannerService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.CATEGORY_BANNER
    }

    async findBanner(options){
        return await this.dbInstance.findOne(this.table, options);
    }

    async allBanners(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async updateBanner(options, data){
        return await this.dbInstance.updateAndFetch(this.table,options, data);
    }
}