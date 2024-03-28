export default class PromotionMapper {
    static async toDTO(data) {
        return {
            code: data.code,
            discount_type: data.discount_type,
            amount: data.amount,
            minimum_spend: data.minimum_spend,
            maximum_spend: data.maximum_spend,
            free_shipping: data.free_shipping,
            description: data.description,
            commence_date: data.commence_date,
            expiry_date: data.expiry_date,
            status: data.status
        };
    }
}
