import OrderService from "../services/order.service.js";
import {ORDER_STATUS} from "../config/order.js";
import OrderMapper from "./order.mapper.js";

export default class CustomerMapper {
    static async toDTO(data) {
        const orderService = new OrderService();

        const orders = await orderService.findAllOrders({user_id: data.id, status: ORDER_STATUS.COMPLETED});
        if(orders.length > 0){
            const orderValue = orders.reduce((acc, order) => acc + order.total_amount, 0);
            orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            const newestOrder = orders[0];

            return {
                user: {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    total_order: orders.length,
                    order_value: parseInt(orderValue),
                    status: data.status,
                    last_active: newestOrder.created_at
                },
            }

        }else{
            return {
                user: {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    total_order: 0,
                    order_value: 0,
                    status: data.status,
                    last_active: null
                },
            }
        }
    }

    static async toDTOUser(data) {
        const orderService = new OrderService();

        const orders = await orderService.findAllOrders({user_id: data.id});
        if(orders.length > 0){
            const orderValue = orders.reduce((acc, order) => acc + order.total_amount, 0);
            orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            const newestOrder = orders[0];

            const ordersDTO = await Promise.all(orders.map(async (order) => {
                return await OrderMapper.dataDTO({...order})
            }))

            return {
                user: {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    total_order: orders.length,
                    order_value: parseInt(orderValue),
                    status: data.status,
                    last_active: newestOrder.created_at,
                    orders: ordersDTO
                },
            }

        }else{
            return {
                user: {
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    total_order: 0,
                    order_value: 0,
                    status: data.status,
                    last_active: null,
                    orders: null
                },
            }
        }
    }
}
