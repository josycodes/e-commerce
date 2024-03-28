import ProductService from "../../../services/product.service.js";
import {NotFound} from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import productMapper from "../../../mappers/product.mapper.js";

export const addToCart = async (req, res, next) => {
    // const cartService = new Cart
    try{
        const { product_id } = req.params;
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not found');

        return new ResponseLib(req, res).json({
            status: true,
            message: "Product Loaded Successfully",
            data: await productMapper.toDTO({...product})
        });
    }
    catch (error) {
        next(error)
    }
}