export default class GeneralShippingMapper {
    static async toDTO(data) {
        return {
            shipping_sales_location_option: data.shipping_sales_location_option,
            customer_location: data.customer_location,
            taxes: data.taxes,
            promotional_codes: data.promotional_codes,
            store_address: data.store_address,
            store_address_postal_code: data.store_address_postal_code
        };
    }
}
