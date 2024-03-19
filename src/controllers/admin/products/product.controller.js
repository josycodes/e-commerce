import ErrorLib, { BadRequest, NotFound } from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import { IncomingForm } from "formidable";
import CloudinaryIntegration from "../../../integrations/cloudinary.integration.js";
import ProductService from "../../../services/product.service.js";
import ProductVariantService from "../../../services/product_variant.service.js";
import ProductCollectionService from "../../../services/product_collection.service.js";
import productMapper from "../../../mappers/product.mapper.js";
import ProductMapper from "../../../mappers/product.mapper.js";

export const create = async (req, res, next) => {
    const productService = new ProductService();
    const productVariantService = new ProductVariantService();
    const productCollectionService = new ProductCollectionService();
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
            const {name, description, variants, collections} = fields;
            const {product_gallery} = files;

            //Field Validation
            if (!name || !description || !variants|| !collections) {
                return res.status(400).json({
                   status:false,
                    message: "Missing required fields: name, description, variants, collections"
                });
            }

            const imagesArray = Array.isArray(product_gallery) ? product_gallery : [product_gallery];
            if(!imagesArray[0]) {
                return res.status(400).json({
                    status: false,
                    message: "product gallery is required"
                });
            }

            await Promise.all(imagesArray.map(image => {
                return new Promise((resolve, reject) => {
                    CloudinaryIntegration.upload(image.filepath, function (error, result) {
                        if (error) {
                            reject(error);
                        } else {
                            console.log(result.secure_url);
                            uploadedImages.push(result.secure_url); // Append URL to the array
                            resolve(); // Resolve the promise
                        }
                    });
                });
            })).catch(error => {
                next(error);
            });
            let product;

            product = await productService.createProduct({
                name: name[0],
                description: description[0]
            });

            //Add product collections
            await Promise.all(collections[0].slice(1, -1).split(',').map(Number).map(async (collection) => {
                await productCollectionService.createProductCollection({
                    product_id: product.id,
                    collection_id: collection
                })
            }));


            //Add Product variants
            await Promise.all(variants.map(async (variant) => {
                let decoded = JSON.parse(variant);
                await Promise.all(decoded.map(async (decoded_variant) => {
                    await productVariantService.createProductVariant({
                        product_id: product.id,
                        variant_id: JSON.stringify(decoded_variant.variant_ids),
                        price: decoded_variant.price,
                        sale_price: decoded_variant.sale_price,
                        stock: decoded_variant.stock,
                        image: JSON.stringify(uploadedImages)
                    });
                }));
            }));

            return new ResponseLib(req, res).json({
                status: true,
                message: "Product Created Successfully",
                data: productMapper.toDTO({...product})
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
        const products = await productService.findAll({});
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


        if(published_status){
            const result3 = await productService.findAll({published: published_status});
            result3.forEach(row => {
                productIDs.push(row.id);
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