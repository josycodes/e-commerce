import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";
import ProductVariantService from "./product_variant.service.js";
import VariantService from "./variant.service.js";

export default class CartService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.CART_ITEM
        this.productVariantService = new ProductVariantService();
        this.variantService = new VariantService();

    }

    async addToCart(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async updateCart(options, data){
        return await this.dbInstance.update(this.table, options, data);
    }

    async findCartItem(options){
        return await this.dbInstance.findOne(this.table,options);
    }

    async deleteCartItem(options){
        return await this.dbInstance.delete(this.table,options);
    }

    async findAllCartItems(options){
        return await this.dbInstance.findAll(this.table, options);
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
}