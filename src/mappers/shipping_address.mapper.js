export default class ShippingAddressMapper {

    static dataDTO(data) {
        return {
           address_line_1: data.address_line_1,
           address_line_2: data.address_line_2,
           city: data.city,
           state: data.state,
           postal_code: data.postal_code,
           latitude: data.latitude,
           longitude: data.longitude,
           country: data.country
        };
    }
}
