import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";
import UserService from "./user.service.js";
import OrderItemService from "./order_item.service.js";

export default class OrderService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.ORDER;
        this.userService = new UserService();
        this.orderItemService = new OrderItemService();
    }

    async GetOrderCustomer(order_id){
        const order =  await this.dbInstance.findOne(this.table, {id: order_id});
        return await this.userService.findUser({id: order.user_id});
    }

    async findAllOrders(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async findProductFromOrders(options, product_id){
        const orders = await this.dbInstance.findAll(this.table, options);

        // await this.orderItemService.getOrderItems({order_id: order.id});
    }
}