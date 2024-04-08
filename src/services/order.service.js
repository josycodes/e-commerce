import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";
import UserService from "./user.service.js";

export default class OrderService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.ORDER;
        this.userService = new UserService();
    }

    async GetOrderCustomer(order_id){
        const order =  await this.dbInstance.findOne(this.table, {id: order_id});
        return await this.userService.findUser({id: order.user_id});
    }
}