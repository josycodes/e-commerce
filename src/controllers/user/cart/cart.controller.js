import ProductService from "../../../services/product.service.js";
import ErrorLib, {NotFound} from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import productMapper from "../../../mappers/product.mapper.js";
import ProductVariantService from "../../../services/product_variant.service.js";
import CartService from "../../../services/cart.service.js";
import CartMapper from "../../../mappers/cart.mapper.js";

export const addToCart = async (req, res, next) => {
    const productService = new ProductService();
    const productVariantService = new ProductVariantService();
    const cartService = new CartService();
    try{
        const user = req.user;
        const { product_id, product_variant_id, quantity } = req.body;

        //find Product
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not found');

        //Find Variant
        const productVariant = await productVariantService.findProductVariant({id: variant_id});
        if(!productVariant) throw new NotFound('Product Variant not found');

        //check product Quantity
        if((quantity - productVariant.stock) < 1) throw new ErrorLib('Product not available')

        //Add to cart
        const cart_item = await cartService.addToCart({
            product_id,
            user_id: user.id,
            product_variant_id,
            quantity
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "Product added to Cart",
            data: await CartMapper.dataDTO(cart_item)
        });
    }
    catch (error) {
        next(error)
    }
}