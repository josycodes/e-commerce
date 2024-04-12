import ProductService from "../../../services/product.service.js";
import { NotFound } from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import productMapper from "../../../mappers/product.mapper.js";
import ProductMapper from "../../../mappers/product.mapper.js";
import OrderService from "../../../services/order.service.js";

export const addReview = async (req, res, next) => {
    const productService = new ProductService();
    const orderService = new OrderService();
    try{
        const user = req.user;
        const { product_id } = req.params;
        const { stars, review } = req.body;
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not found');

        //check that user has ordered for the product
        await orderService.findProductFromOrders({user_id: user.id}, product_id);

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

export const getAll = async(req, res, next) => {
    const productService = new ProductService();
    try{
        const products = await productService.findAll({published: true});
        const productsDTO = await Promise.all(products.map(async (product) => {
            return await ProductMapper.userdataDTO({...product});
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Products Loaded",
            data: productsDTO
        });
    }
    catch (error) {
        next(error)
    }
}
