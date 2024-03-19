import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";
import ProductVariantService from "./product_variant.service.js";
import VariantService from "./variant.service.js";

export default class ProductService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.PRODUCT
        this.productVariantService = new ProductVariantService();
        this.variantService = new VariantService();

    }

    async createProduct(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async findProduct(options){
        return await this.dbInstance.findOne(this.table,options);
    }

    async findAll(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async findAllWhereIn(columnName, data){
        return await this.dbInstance.findWhereIn(this.table,columnName,data);
    }

    async productVariants(product_id){
        const variants = await this.productVariantService.findVariants({ product_id });

        // Fetch details of each variant using VariantService
        return await Promise.all(variants.map(async (variant) => {
            const variantPromises = variant.variant_id.map(async (variantID) => {
                return this.variantService.findVariant({id: variantID});
            });
            const variantResults = await Promise.all(variantPromises);
            return {
                variant: variantResults,
                price: variant.price,
                sale_price: variant.sale_price,
                stock: variant.stock,
                image: variant.images
            }
        }))
    }

    /**
     *
     * @param product_id
     * @returns {Promise<*>}
     */
    async productVariantTotalStock(product_id){
        const variants = await this.productVariantService.findVariants({ product_id });
        return variants.reduce((acc, variant) => acc + variant.stock, 0)
    }

    async productTotalStock(product_id){
        const total = await this.productVariantService.getTotalStock('stock', { product_id });
        return total.sum !== null ? parseInt(total.sum, 10) : 0
    }
}