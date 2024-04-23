import OrderItemService from "../services/order_item.service.js";
import OrderItemMapper from "./order_item.mapper.js";
import ShippingAddressService from "../services/shipping_address.service.js";

export default class OrderMapper {

    static async dataDTO(data) {
        const orderItemService = new OrderItemService();
        const shippingAddressService = new ShippingAddressService();

        const order_items = await orderItemService.getOrderItems({
            order_id: data.id
        });

        const orderItemsDTO = await Promise.all(order_items.map(async (order_item) => {
            return await OrderItemMapper.toDTO({...order_item})
        }))

        let shipping_address = null;
        if(data.shipping_address_id !== null){
            shipping_address = await shippingAddressService.getShippingAddress({
                id: data.shipping_address_id
            })
        }

        return {
            total_amount: data.total_amount,
            order_items: orderItemsDTO,
            shipping_address: shipping_address ? shipping_address : null
        };
    }
}
