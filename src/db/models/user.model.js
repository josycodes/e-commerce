import {dbORM} from "../connect.js";
import {TABLE} from "../tables.js";
import { Order } from "./order.model.js";

export const User = dbORM.Model.extend({
    tableName: TABLE.USER,
    orders: function () {
        return this.hasMany(Order);
    }
})
