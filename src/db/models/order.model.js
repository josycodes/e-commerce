import {dbORM} from "../connect.js";
import {TABLE} from "../tables.js";
import { User } from "./user.model.js";

export const Order = dbORM.Model.extend({
    tableName: TABLE.ORDER,
    user: function () {
        return this.belongsTo(User);
    }
});