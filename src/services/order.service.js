import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";

export default class OrderService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.ORDER;
    }
}