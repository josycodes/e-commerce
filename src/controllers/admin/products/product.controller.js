import ErrorLib, {BadRequest, NotFound} from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import {IncomingForm} from "formidable";
import moment from "moment";
import CloudinaryIntegration from "../../../integrations/cloudinary.integration.js";
import ProductService from "../../../services/product.service.js";
import ProductVariantService from "../../../services/product_variant.service.js";
import productMapper from "../../../mappers/product.mapper.js";
import ProductMapper from "../../../mappers/product.mapper.js";
import ProductCategoriesService from "../../../services/product_categories.service.js";
import CategoryService from "../../../services/category.service.js";
import DiscountService from "../../../services/discount.service.js";
import ProductDiscountService from "../../../services/product_discount.service.js";
import ShippingMethodService from "../../../services/shipping_method.service.js";
import ShippingMethodMapper from "../../../mappers/shipping_method.mapper.js";
import OrderItemService from "../../../services/order_item.service.js";

export const create = async (req, res, next) => {
    const productService = new ProductService();
    const productDiscount = new ProductDiscountService();
    const productVariantService = new ProductVariantService();
    const productCategoryService = new ProductCategoriesService();
    try {
        const form = new IncomingForm();
        const uploadedImages = [];
        await form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: "Error Parsing form"
                });
            }

            // Access form fields
            const { name, description, variants, categories, tags, measuring_unit, sku, discount_id, tax_id, shipping_id } = fields;
            const { product_gallery } = files;

            //Field Validation
            if (!name || !description || !variants || !categories) {
                return res.status(400).json({
                   status:false,
                    message: "Missing required fields: name, description, variants, collections"
                });
            }

            const imagesArray = Array.isArray(product_gallery) ? product_gallery : [product_gallery];
            if(!imagesArray[0]) {
                return res.status(400).json({
                    status: false,
                    message: "product gallery is required",
                    request_data: product_gallery,
                    images_array: imagesArray
                });
            }

            await Promise.all(imagesArray.map(image => {
                return new Promise((resolve, reject) => {
                    CloudinaryIntegration.upload(image.filepath, function (error, result) {
                        if (error) {
                            reject(error);
                        } else {
                            uploadedImages.push(result.secure_url); // Append URL to the array
                            resolve();
                        }
                    });
                });
            })).catch(error => {
                next(error);
            });
            let product;

            product = await productService.createProduct({
                name: name[0],
                description: description[0],
                images: JSON.stringify(uploadedImages),
                sku: sku ? sku[0] : null,
                measuring_unit: measuring_unit[0],
                // discount_id: discount_id ? discount_id[0]: null,
                shipping_id: shipping_id ? shipping_id[0] : null,
                tax_id: tax_id ? tax_id[0] : null,
                tags: tags ? tags[0] : null
            });

            if(discount_id){
                await productDiscount.createProductDiscounts({
                    product_id: product.id,
                    discount_id: discount_id
                });
            }


            //Add product categories
            await Promise.all(categories[0].slice(1, -1).split(',').map(Number).map(async (category) => {
                await productCategoryService.createProductCategory({
                    product_id: product.id,
                    category_id: category
                })
            }));

            //Add Product variants
            await Promise.all(variants.map(async (variant) => {
                let decoded = JSON.parse(variant);
                await Promise.all(decoded.map(async (decoded_variant, index) => {
                    let image_url = null;
                    const key = `variant${index}`;
                    const [variantImage] = files[key];
                    // console.log('///////////////////////', variantImage.filepath, '==============',files[key]);

                    if(variantImage){
                        await CloudinaryIntegration.upload(variantImage.filepath, function (error, result) {
                            if (error) {
                                next(error);
                            } else {
                                image_url = result.secure_url; // Append URL to the array
                            }
                        });
                    }

                    await productVariantService.createProductVariant({
                        product_id: product.id,
                        variants: JSON.stringify(decoded_variant.variants),
                        sale_price: decoded_variant.sale_price,
                        cost_price: decoded_variant.cost_price,
                        profit: decoded_variant.profit,
                        stock: decoded_variant.stock,
                        image: image_url
                    });
                }));
            }));

            return new ResponseLib(req, res).json({
                status: true,
                message: "Product Created Successfully",
                data: await productMapper.toDTO({...product})
            });
        });
    } catch (error) {
        // Handle known errors
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const getProduct = async (req, res, next) => {
    const productService = new ProductService();
    const productCategoryService = new ProductCategoriesService();
    const categoryService = new CategoryService();
    const discountService = new DiscountService();
    const productDiscountService = new ProductDiscountService();
    const shippingMethodService = new ShippingMethodService();
    const orderItemService = new OrderItemService();
    try{
        const { product_id } = req.params;
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not found');

        const product_categories = await productCategoryService.findProductCategory({product_id});
        const variants = await productService.productVariants(product.id);
        const categoryIds = product_categories.map(category => category.category_id);
        const categories = await categoryService.findCategoryWhereIn('id', categoryIds);

        const discount_products = await productDiscountService.getAllProductDiscounts({product_id});
        const discountsIds = discount_products.map(discount_product => discount_product.discount_id);
        const discounts = await discountService.findAllDiscountsWhereIn('id', discountsIds);

        let shipping = null;
        if(product.shipping_id){
            const shipping_method = await shippingMethodService.findShippingMethod({id: product.shipping_id});

            const method_conditions = await shippingMethodService.getShippingMethodConditions(shipping_method.type, {
                shipping_method_id: shipping_method.id
            })
            shipping = ShippingMethodMapper.toDTO({...shipping_method}, method_conditions);
        }

        //INCOME and REVENUE
        const orderItems = await orderItemService.getOrderItems({ product_id: product.id });
        //TOTAL REVENUE
        let TotalRevenue = 0;
        let TotalProfit = 0;
        if(orderItems.length > 0){
            const updatedOrderItems = orderItems.map(orderItem => {
                // Calculate the sale price by multiplying the amount with the quantity
                const salePrice = Number(orderItem.amount) * orderItem.quantity;
                const variantIds = orderItems.map(orderItem => orderItem.variant_id);
                const filteredVariants = variants.filter(item => variantIds.includes(item.id));
                const matchingVariant = filteredVariants.find(variant => variant.id === orderItem.variant_id);
                let profitAmount = 0;
                if (matchingVariant) {
                    // Calculate the sale price
                    profitAmount = Number(orderItem.amount - matchingVariant.cost_price) * orderItem.quantity;
                }

                return {
                    ...orderItem,
                    sale_price: salePrice,
                    profit_amount: profitAmount
                };
            });

            TotalRevenue = updatedOrderItems.reduce((total, orderItem) => {
                return total + orderItem.sale_price;
            }, 0);

            TotalProfit = updatedOrderItems.reduce((total, orderItem) => {
                return total + orderItem.profit_amount;
            }, 0);

        }

        /** MONTHLY CALCULATIONS */
        // Get the current month
        const currentMonth = moment().month();
        // Group orderItems by month
        const orderItemsByMonth = orderItems.reduce((acc, orderItem) => {
            const month = moment(orderItem.created_at).format('YYYY-MM');

            if (!acc[month]) {
                acc[month] = [];
            }

            acc[month].push(orderItem);

            return acc;
        }, {});
        const monthlyTotalRevenue = {};
        const monthlyTotalProfit = {};
        for (const month in orderItemsByMonth) {
            if (Object.hasOwnProperty.call(orderItemsByMonth, month)) {
                const orderItems = orderItemsByMonth[month];

                // Calculate sale price for each order item
                const updatedOrderItems = orderItems.map(orderItem => {
                    const salePrice = Number(orderItem.amount) * orderItem.quantity;
                    const variantIds = orderItems.map(orderItem => orderItem.variant_id);
                    const filteredVariants = variants.filter(item => variantIds.includes(item.id));
                    const matchingVariant = filteredVariants.find(variant => variant.id === orderItem.variant_id);
                    let profitAmount = 0;
                    if (matchingVariant) {
                        // Calculate the sale price
                        profitAmount = Number(orderItem.amount - matchingVariant.cost_price) * orderItem.quantity;
                    }
                    return {
                        ...orderItem,
                        sale_price: salePrice,
                        profit_amount: profitAmount
                    };
                });

                // Store the total revenue for the month
                monthlyTotalRevenue[month] = updatedOrderItems.reduce((total, orderItem) => {
                    return total + orderItem.sale_price;
                }, 0);

                monthlyTotalProfit[month] = updatedOrderItems.reduce((total, orderItem) => {
                    return total + orderItem.profit_amount;
                }, 0);
            }
        }

        //CURRENT MONTHLY REVENUE
        const orderItemsInCurrentMonth = orderItems.filter(orderItem => {
            const createdAtMonth = moment(orderItem.created_at).month();
            return createdAtMonth === currentMonth;
        });
        let currentMonthTotalRevenue = 0;
        if(orderItemsInCurrentMonth.length > 0){
            const updatedOrderItemsMonthly = orderItems.map(orderItem => {
                // Calculate the sale price by multiplying the amount with the quantity
                const salePrice = Number(orderItem.amount) * orderItem.quantity;

                return {
                    ...orderItem,
                    sale_price: salePrice,

                };
            });

            currentMonthTotalRevenue = updatedOrderItemsMonthly.reduce((total, orderItem) => {
                return total + orderItem.sale_price;
            }, 0);
        }


        return new ResponseLib(req, res).json({
            status: true,
            message: "Product Loaded Successfully",
            data: await productMapper.toDTO({...product}),
            category: categories,
            discounts: discounts,
            shipping: shipping,
            analytics: {
                monthly_recurring_revenue: currentMonthTotalRevenue,
                monthly_sold: orderItemsInCurrentMonth.length,
                profit:{
                    total: TotalProfit,
                    monthlyTotalProfit
                },
                revenue:{
                    total: TotalRevenue,
                    monthlyTotalRevenue
                }
            }
        });
    }
    catch (error) {
        next(error)
    }
}

export const getAll = async(req, res, next) => {
    const productService = new ProductService();
    try{
        const products = await productService.findAll({});
        const productsDTO = await Promise.all(products.map(async (product) => {
            return await ProductMapper.toDTO({...product});
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Products Loaded",
            data: productsDTO,
            all_products: productsDTO.length,
            published_products: productsDTO.filter(item => item.product.published).length,
            inactive_products: productsDTO.filter(item => !item.product.published).length,
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
    const { search, min_price, max_price, category_id, published_status } = req.body;
    let productIDs = [];
    const options = {};
    try{
        const allProducts = await productService.findAllCount();
        const publishedProducts = await productService.findAllCount({published: true});
        const unpublishedProducts = await productService.findAllCount({published: false});

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

        if(category_id){
            const result2 = await productCategoryService.findProductsCategoryWhereIn('category_id', category_id);
            result2.forEach(row => {
                productIDs.push(row.product_id);
            });
        }


        if(published_status){
            const result3 = await productService.findAll({published: published_status});
            result3.forEach(row => {
                productIDs.push(row.id);
            });
        }

        if(search){
            const result4 = await productService.findProductLIKE({columnName: 'name',search: `%${search}%`});
            result4.forEach(row => {
                productIDs.push(row.id);
            });
        }

        //merge productIDs
        const uniqueProductIDs = [...new Set(productIDs)];
        const products = await productService.findAllWhereIn('id', uniqueProductIDs);
        const productsDTO = await Promise.all(products.map(async (product) => {
            return await ProductMapper.toDTO({...product});
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Products Loaded",
            data: productsDTO,
            all_products: allProducts[0].count,
            published_products: publishedProducts[0].count,
            inactive_products: unpublishedProducts[0].count,
        });
    }
    catch (error) {
        next(error)
    }
}

export const updateProductStatus = async (req, res, next) => {
    const productService = new ProductService();
    const { product_id } = req.params;
    const { published_status } = req.body;
    try{
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not found');

        const updated_product = await productService.updateProduct(
            {
                id: product.id
            },
            {
                published: published_status,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
        );

        return new ResponseLib(req, res).json({
            status: true,
            message: "Product updated",
            data: await ProductMapper.toDTO({...updated_product})
        });
    }
    catch (error) {
        next(error)
    }
}

export const restockProduct = async (req, res, next) => {
    const productService = new ProductService();
    const productVariantService = new ProductVariantService();
    const { product_id } = req.params;
    const { variant_id, restock_quantity } = req.body;
    try{
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not found');

        const productVariant = await productVariantService.findProductVariant({id: variant_id});
        if(!productVariant) throw new NotFound('Invalid Product Variant');

        await productVariantService.updateProductVariant({id: productVariant.id}, {stock: productVariant.stock + restock_quantity})

        return new ResponseLib(req, res).json({
            status: true,
            message: "Product Restocked"
        });
    }
    catch (error) {
        next(error)
    }
}

export const adjustStockProduct = async (req, res, next) => {
    const productService = new ProductService();
    const productVariantService = new ProductVariantService();
    const { product_id } = req.params;
    const { variant_id, new_quantity } = req.body;
    try{
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not found');

        const productVariant = await productVariantService.findProductVariant({id: variant_id});
        if(!productVariant) throw new NotFound('Invalid Product Variant');

        await productVariantService.updateProductVariant({ id: productVariant.id }, {stock: new_quantity})

        return new ResponseLib(req, res).json({
            status: true,
            message: "Product Stock Adjusted"
        });
    }
    catch (error) {
        next(error)
    }
}