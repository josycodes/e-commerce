import ShippingMethodService from "../services/shipping_method.service.js";

export default class ShippingMethodMapper {
    static toDTO(data, conditions) {
        return {
            id: data.id,
            name: data.name,
            type: data.type,
            description: data.description,
            status: data.status,
            conditions: conditions
        };
    }

    static async toDTO2(data) {
        const shippingMethodService = new ShippingMethodService();
        const conditions = await shippingMethodService.getShippingMethodConditions(data.type, {shipping_method_id: data.id});

        return {
            id: data.id,
            name: data.name,
            type: data.type,
            description: data.description,
            status: data.status,
            conditions: conditions
        };
    }
}
