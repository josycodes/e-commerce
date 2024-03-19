import ProductVariantService from "../services/product_variant.service.js";
import VariantService from "../services/variant.service.js";

export default class ProductMapper {
    static async toDTO(data) {
        const productVariantService = new ProductVariantService();
        const variantService = new VariantService();
        const variants = await productVariantService.findVariants({ product_id: data.id });

        // Fetch details of each variant using VariantService
        const variantDetails = await Promise.all(variants.map(async (variant) => {
            const variantPromises = variant.variant_id.map(async (variantID) => {
                return variantService.findVariant({id: variantID});
            });
            const variantResults = await Promise.all(variantPromises);
            return {
                variant: variantResults,
                price: variant.price,
                sale_price: variant.sale_price,
                stock: variant.stock,
                image: variant.images
            }
        }));

        return {
            product: {
                id: data.id,
                name: data.name,
                description: data.description,
                variants: variantDetails,
                total_stock: variants.reduce((acc, variant) => acc + variant.stock, 0)
            }
        };
    }

    static async dataDTO(data) {
        const productVariantService = new ProductVariantService();
        const total = await productVariantService.getTotalStock('stock', {product_id:data.id});
        return {
            product: {
                id: data.id,
                name: data.name,
                description: data.description,
                published: data.published,
                total_stock: total.sum !== null ? parseInt(total.sum, 10) : 0
            }
        };
    }
}
