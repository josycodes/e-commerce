export default class DiscountMapper {
    static toDTO(data, discounted_data) {
        return {
            title: data.title,
            code: data.code,
            discount_type: data.discount_type,
            value: data.value,
            minimum_order_amount: data.minimum_order_amount,
            maximum_customer_use: data.maximum_customer_use,
            maximum_claims: data.maximum_claims,
            description: data.description,
            start_date: data.start_date,
            end_date: data.end_date,
            status: data.status,
            discounted_products: discounted_data ? discounted_data : null
        };
    }
}
