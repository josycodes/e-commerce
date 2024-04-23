import ProductService from "../services/product.service.js";
import ProductVariantService from "../services/product_variant.service.js";
import DiscountService from "../services/discount.service.js";

export default class OrderItemMapper {
    static async toDTO(data) {
        const productService = new ProductService();
        const productVariantService = new ProductVariantService();
        const discountService = new DiscountService();

        const product = await productService.findProduct({
            id: data.product_id
        });

        const variant = await productVariantService.findProductVariant({
            id: data.variant_id
        });
        let discount = null
        if(data.discount_id !== null){
           discount = await discountService.getDiscount({
                id: data.discount_id
            })
        }

        return {
            product: product,
            variant: variant,
            quantity: data.quantity,
            amount: data.amount,
            discount: discount ? discount : null
        }
    }
}