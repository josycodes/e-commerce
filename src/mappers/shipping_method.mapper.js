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
}
