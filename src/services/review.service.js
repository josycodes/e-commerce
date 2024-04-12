import LoggerLib from "../libs/Logger.lib.js";
import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class ReviewService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.REVIEW
    }

    async createReview(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }
}