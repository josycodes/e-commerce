import ProductService from "../services/product.service.js";

export default class CartMapper {
    // static async toDTO(data) {
    //     const productService = new ProductService();
    //     const variants = await productService.productVariants(data.id);
    //     const total_stock = await productService.productVariantTotalStock(data.id);
    //
    //     return {
    //         product: {
    //             id: data.id,
    //             name: data.name,
    //             description: data.description,
    //             published: data.published,
    //             variants,
    //             total_stock,
    //             images: data.images
    //         }
    //     };
    // }

    static async dataDTO(data) {
        const productService = new ProductService();
        const total_stock = await productService.productTotalStock(data.product_id);
        const product = await productService.findProduct({id: data.product_id});
        const variants = await productService.productVariantsUser(data.id);
        return {
            quantity: data.quantity,
            product_variant_id: data.product_variant_id,
            product: {
                id: product.id,
                name: product.name,
                description: product.description,
                published: product.published,
                images: product.images,
                sku: product.sku,
                tags: product.tags,
                measuring_unit: product.measuring_unit,
                total_stock,
                variants
            }
        };
    }
}
