import ProductMapper from "./product.mapper.js";
import ProductService from "../services/product.service.js";
import {ORDER_STATUS} from "../config/order.js";
import OrderService from "../services/order.service.js";
import UserService from "../services/user.service.js";
import UserMapper from "./user.mapper.js";

export default class ReviewMapper {
    static async toDTO(data, user = null) {
        const orderService = new OrderService();

        let orderItemWithProduct = null;
        if(user){
            orderItemWithProduct = await orderService.findProductFromOrders({user_id: user.id, status: ORDER_STATUS.COMPLETED}, data.product_id);
        }

        return {
            rating: data.rating,
            review: data.comment,
            product_completed_orders: orderItemWithProduct,
            created_at: data.created_at
        }

    }

    static async userToDTO(data) {
        //Reviews with User(Reviewer) Data
        const userService = new UserService();
        const user_data = await userService.findUser({id: data.user_id})
        const { user } = UserMapper.toViewDTO({...user_data});
        return {
            rating: data.rating,
            review: data.comment,
            user,
            created_at: data.created_at
        }
    }

    static async productToDTO(data, user = null) {
        //Reviews with Product Data
        const orderService = new OrderService();
        const productService = new ProductService();

        const product_data = await productService.findProduct({id: data.product_id});
        const { product } = await ProductMapper.userdataDTO({...product_data}, false);

        let orderItemWithProduct = null;
        if(user){
            orderItemWithProduct = await orderService.findProductFromOrders({user_id: user.id, status: ORDER_STATUS.COMPLETED}, data.product_id);
        }

        return {
            rating: data.rating,
            review: data.comment,
            product,
            product_completed_orders: orderItemWithProduct,
            created_at: data.created_at
        }

    }
}
