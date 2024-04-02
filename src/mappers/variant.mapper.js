export default class VariantMapper {
    static toDTO(data) {
        return {
            variants: data.variants,
            price: data.sale_price,
            stock: data.stock,
            image: data.image
        }

    }
}
