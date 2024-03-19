import ProductService from "../../../services/product.service.js";
import {NotFound} from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import productMapper from "../../../mappers/product.mapper.js";
import ProductMapper from "../../../mappers/product.mapper.js";
import ProductVariantService from "../../../services/product_variant.service.js";
import ProductCollectionService from "../../../services/product_collection.service.js";

export const getProduct = async (req, res, next) => {
    const productService = new ProductService();
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

export const getAll = async(req, res, next) => {
    const productService = new ProductService();
    try{
        const products = await productService.findAll({published: true});
        const productsDTO = await Promise.all(products.map(async (product) => {
            return ProductMapper.toDTO({...product});
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

export const filterProducts = async (req, res, next) => {
    const productVariantService = new ProductVariantService();
    const productCollectionService = new ProductCollectionService();
    const productService = new ProductService();
    const { min_price, max_price, collection_id, published_status } = req.body;
    let productIDs = [];
    const options = {};
    try{
        if(min_price || max_price){
            //Max Price
            if (max_price !== undefined) {
                options.max_price = max_price;
            }
            // Min price
            if (min_price !== undefined) {
                options.min_price = min_price;
            }
            const result = await productVariantService.filterQuery(options);

            result.forEach(row => {
                productIDs.push(row.product_id);
            });
        }

        if(collection_id){
            const result2 = await productCollectionService.findProductCollectionWhereIn('collection_id', collection_id);
            result2.forEach(row => {
                productIDs.push(row.product_id);
            });
        }

        //merge productIDs
        const uniqueProductIDs = [...new Set(productIDs)];

        const products = await productService.findAllWhereIn('id', uniqueProductIDs);
        const productsDTO = await Promise.all(products.map(async (product) => {
            return ProductMapper.toDTO({...product});
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