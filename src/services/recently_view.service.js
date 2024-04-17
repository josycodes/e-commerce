import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";
import ProductVariantService from "./product_variant.service.js";
import VariantService from "./variant.service.js";

export default class RecentlyViewService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.RECENTLY_VIEW

    }

    async addToRecentlyView(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async findOneRecentlyView(options){
        return await this.dbInstance.findOne(this.table, options);
    }

    async findAllRecentlyViewItems(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async updateRecentlyView(options, data){
        return await this.dbInstance.update(this.table, options, data);
    }

    async removeOldestRecentlyView(){
        const [data] = await this.dbInstance.orderByFindOne(this.table, 'created_at','desc', 1);
        await this.dbInstance.delete(this.table, {id: data.id});
    }
}