import SalesLocationService from "../services/sales_location.service.js";
export default class GeneralShippingMapper {
    static async toDTO(data, conditions) {
        const saleLocationService = new SalesLocationService();
        const sales_location = await saleLocationService.getSalesLocation();
        return {
            store_address: data.store_address,
            country: data.country,
            state: data.state,
            city: data.city,
            zip_code: data.zip_code,
            taxes: data.taxes,
            payment_on_delivery: data.payment_on_delivery,
            discount: data.discount,
            sales_location: sales_location
        };
    }
}
