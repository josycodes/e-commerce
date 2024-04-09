export default class ShippingMethodMapper {
    static toDTO(data, conditions) {
        return {
            name: data.name,
            type: data.type,
            description: data.description,
            status: data.status,
            conditions: conditions
        };
    }
}
