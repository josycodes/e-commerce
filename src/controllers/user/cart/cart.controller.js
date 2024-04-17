import ProductService from "../../../services/product.service.js";
import ErrorLib, {NotFound} from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
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
        const productVariant = await productVariantService.findProductVariant({id: product_variant_id});
        if(!productVariant) throw new NotFound('Product Variant not found');

        //check product Quantity
        if((productVariant.stock - quantity) < 1) throw new ErrorLib('Product not available')

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
            data: await CartMapper.dataDTO({...cart_item})
        });
    }
    catch (error) {
        next(error)
    }
}

export const listCartItems = async (req, res, next) => {
    const cartService = new CartService();
    try{
        const user = req.user;

        const cart_items = await cartService.findAllCartItems({
            user_id: user.id
        });
        const cartItemsDTO = await Promise.all(cart_items.map(async (cart_item) => {
            return await CartMapper.dataDTO({...cart_item})
        }));

        //Cart Summary
        

        return new ResponseLib(req, res).json({
            status: true,
            message: "Cart Items Loaded",
            data: cartItemsDTO
        });
    }
    catch (error) {
        next(error)
    }
}

export const updateCartItem = async (req, res, next) => {
    const cartService = new CartService();
    const productService = new ProductService();
    const productVariantService = new ProductVariantService();
    try{
        const user = req.user;
        const { product_id } = req.params;
        const { type }  = req.body;

        const cart_item = await cartService.findCartItem({
            user_id: user.id,
            product_id: product_id
        });

        let quantity;

        if(type === 'add'){
            quantity = cart_item.quantity + 1;
        }else{
            quantity = cart_item.quantity - 1;
        }


        //find Product
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not found');

        //Find Variant
        const productVariant = await productVariantService.findProductVariant({id: cart_item.product_variant_id});
        if(!productVariant) throw new NotFound('Product Variant not found');

        //check product Quantity
        if((productVariant.stock - quantity) < 1) throw new ErrorLib('Product not available')

        await cartService.updateCart({
            user_id: user.id,
            product_id
        }, {quantity});

        return new ResponseLib(req, res).json({
            status: true,
            message: "updated"
        });
    }
    catch (error) {
        next(error)
    }
}

export const removeCartItem = async (req, res, next) => {
    const cartService = new CartService();
    try{
        const user = req.user;
        const { product_id } = req.params;

        await cartService.deleteCartItem({
            user_id: user.id,
            product_id
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "deleted"
        });
    }
    catch (error) {
        next(error)
    }
}