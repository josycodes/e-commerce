import ProductService from "../services/product.service.js";

export default class CartMapper {
    static async toDTO(data) {
        const productService = new ProductService();
        const variants = await productService.productVariants(data.id);
        const total_stock = await productService.productVariantTotalStock(data.id);

        return {
            product: {
                id: data.id,
                name: data.name,
                description: data.description,
                published: data.published,
                variants,
                total_stock
            }
        };
    }

    static async dataDTO(data) {
        const productService = new ProductService();
        const total_stock = await productService.productTotalStock(data.id);
        return {
            product: {
                id: data.id,
                name: data.name,
                description: data.description,
                published: data.published,
                total_stock
            }
        };
    }
}
