import ProductService from "../../../services/product.service.js";
import {NotFound} from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import productMapper from "../../../mappers/product.mapper.js";
import ProductMapper from "../../../mappers/product.mapper.js";
import ProductVariantService from "../../../services/product_variant.service.js";
import ProductCategoriesService from "../../../services/product_categories.service.js";
import OrderItemService from "../../../services/order_item.service.js";
import ReviewService from "../../../services/review.service.js";
import ShippingMethodService from "../../../services/shipping_method.service.js";
import UtilsService from "../../../services/Utils.service.js";

export const getProduct = async (req, res, next) => {
    const productService = new ProductService();
    try{
        const { product_id } = req.params;
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not found');

        return new ResponseLib(req, res).json({
            status: true,
            message: "Product Loaded Successfully",
            data: await productMapper.userdataDTO({...product})
        });
    }
    catch (error) {
        next(error)
    }
}

export const similarProducts = async (req, res, next) => {
    const productService = new ProductService();
    const productCategoryService = new ProductCategoriesService()
    try{
        const { limit, page } = req.query;
        const { product_id } = req.params;

        const product_categories = await productCategoryService.findProductCategory({ product_id });
        const product_ids = product_categories.map(category => category.product_id);


        const data = await productService.findAllWhereInOptionsPaginate('id',product_ids,{published: true}, limit, page);
        if(!data) throw new NotFound('Products not found');
        const total = parseInt(data.total[0].count);
        const products = data.data;

        const productsDTO = await Promise.all(products.map(async (product) => {
            return await ProductMapper.userdataDTO({...product});
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Product Loaded Successfully",
            data: productsDTO,
            meta: UtilsService.paginate(req.query, {total})
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

export const filterProducts = async (req, res, next) => {
    const productVariantService = new ProductVariantService();
    const productCategoryService = new ProductCategoriesService();
    const productService = new ProductService();
    const reviewService = new ReviewService();
    const { page, limit } = req.query;
    const { min_price, max_price, category_id, search, shipping_id, rating, variants } = req.body;
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
            const result = await productVariantService.filterQuery(options, 'sale_price');

            result.forEach(row => {
                productIDs.push(row.product_id);
            });
        }

        if(category_id){
            const result2 = await productCategoryService.findProductsCategoryWhereIn('category_id', category_id);
            result2.forEach(row => {
                productIDs.push(row.product_id);
            });
        }

        if(search){
            const result3 = await productService.findProductLIKE({columnName: 'name',search: `%${search}%`});
            result3.forEach(row => {
                productIDs.push(row.id);
            });
        }

        if(shipping_id){
            const result4 = await productService.findAllWhereInOptions('shipping_id',shipping_id, {published: true});
            result4.forEach(row => {
                productIDs.push(row.id);
            });
        }

        if(rating){
            const result5 = await reviewService.findAllWhereIn('rating', rating);
            result5.forEach(row => {
                productIDs.push(row.product_id);
            });
        }

        if(variants){
            const keys = Object.keys(variants);

            const query = keys.map(key => {
                const values = variants[key];
                return `variants->>'${key}' IN ('${values.join("','")}')`;
            }).join(' OR ');

            const sql = `${query}`;
            const result6 = await productVariantService.whereRaw(sql);
            result6.forEach(row => {
                productIDs.push(row.product_id);
            });
        }

        //merge productIDs
        const uniqueProductIDs = [...new Set(productIDs)];

        const data = await productService.findAllWhereInOptionsPaginate('id', uniqueProductIDs, {published: true}, limit, page);
        const total = parseInt(data.total[0].count);
        const products = data.data;


        const productsDTO = await Promise.all(products.map(async (product) => {
            return ProductMapper.userdataDTO({...product});
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Products Loaded",
            data: productsDTO,
            meta: UtilsService.paginate(req.query, { items: productsDTO, total: total })
        });
    }
    catch (error) {
        next(error)
    }
}


export const trendingProducts = async (req, res, next) => {
    const productService = new ProductService();
    const orderItemService = new OrderItemService();

    try{
        const trending_productID = await orderItemService.getProductOrderGroupBy('product_id',20);

        const productIds = trending_productID.map(row => row.product_id);

        const products = await productService.findAllWhereInOptions('id', productIds, {published: true});
        const productsDTO = await Promise.all(products.map(async (product) => {
            return ProductMapper.userdataDTO({...product});
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Trending Products Loaded",
            data: productsDTO
        });
    }
    catch (error) {
        next(error)
    }
}

export const randomProducts = async (req, res, next) => {
    const productService = new ProductService();

    try{
        const random_productID = await productService.findAllOrderByRaw('id','RAND()',20);
        const productIds = random_productID.map(row => row.id);

        const products = await productService.findAllWhereInOptions('id', productIds, {published: true});
        const productsDTO = await Promise.all(products.map(async (product) => {
            return ProductMapper.userdataDTO({...product});
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Random Products Loaded",
            data: productsDTO
        });
    }
    catch (error) {
        next(error)
    }
}

export const productVariants = async (req, res, next) => {
    const productVariantService = new ProductVariantService();

    try{
        const data = await productVariantService.getDistinctVariantsRawQuery(
            'CROSS JOIN LATERAL json_each_text(variants) AS extracted_data','extracted_data.key', 'extracted_data.value');

        const groupedData = data.reduce((acc, obj) => {
            if (!acc[obj.key]) {
                acc[obj.key] = [obj.value];
            } else {
                acc[obj.key].push(obj.value);
            }
            return acc;
        }, {});


        return new ResponseLib(req, res).json({
            status: true,
            message: "Loaded",
            data: groupedData
        });
    }
    catch (error) {
        next(error)
    }
}

export const productReviews = async (req, res, next) => {
    const reviewService = new ReviewService();

    try{

        const data = await reviewService.findAllReviewsGroupBy('rating');

        return new ResponseLib(req, res).json({
            status: true,
            message: "Loaded",
            data
        });
    }
    catch (error) {
        next(error)
    }
}

export const productShipping = async (req, res, next) => {
    const productService = new ProductService();
    const shippingMethodService = new ShippingMethodService();

    try{

        const data = await productService.findProductGroupBy('shipping_id')
            .then(async rows => {
                // const productData = [];
                for (const row of rows) {
                    row.shipping = await shippingMethodService.findShippingMethod({id: row.shipping_id});
                    // productData.push(row);
                }
                return rows;
            });


        return new ResponseLib(req, res).json({
            status: true,
            message: "Loaded",
            data
        });
    }
    catch (error) {
        next(error)
    }
}