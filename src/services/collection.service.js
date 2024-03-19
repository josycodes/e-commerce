import LoggerLib from "../libs/Logger.lib.js";
import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class CollectionService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.COLLECTION
    }

    async createCollection(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async getAllCollections(){
        return await this.dbInstance.findAll(this.table);
    }

    async findCollection(options){
        return await this.dbInstance.findOne(this.table, options);
    }

    async updateCollection(options, data){
        return await this.dbInstance.updateAndFetch(this.table, options, data);
    }

    async deleteCollection(options){
        return await this.dbInstance.delete(this.table, options);
    }
}