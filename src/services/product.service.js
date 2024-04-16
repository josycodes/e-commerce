import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";
import ProductVariantService from "./product_variant.service.js";

export default class ProductService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.PRODUCT
        this.productVariantService = new ProductVariantService();
    }

    async createProduct(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async findProduct(options){
        return await this.dbInstance.findOne(this.table,options);
    }

    async findProductLIKE(options){
        return await this.dbInstance.findAllLIKE(this.table,options);
    }

    async findProductGroupBy(columnName){
        return await this.dbInstance.groupByWithCount(this.table,columnName);
    }

    async updateProduct(options, data){
        return await this.dbInstance.updateAndFetch(this.table,options, data);
    }

    async findAll(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async findAllOrderByRaw(columnName, rawQuery, limit){
        return this.dbInstance.orderByRaw(this.table,columnName,rawQuery, limit);
    }

    async findAllCount(options){
        return await this.dbInstance.findAndCount(this.table, options);
    }

    async findAllWhereIn(columnName, data){
        return await this.dbInstance.findWhereIn(this.table,columnName,data);
    }

    async findAllWhereInOptions(columnName, data, options){
        return await this.dbInstance.findWhereInOptions(this.table,columnName,data, options);
    }

    async productVariants(product_id){
        const variants = await this.productVariantService.findVariants({ product_id: product_id });

        return await Promise.all(variants.map(async (variant) => {
            return {
                id: variant.id,
                variant: variant.variants,
                price: variant.sale_price,
                cost_price: variant.cost_price,
                profit: variant.profit,
                stock: variant.stock,
                image: variant.image
            }
        }))
    }

    async findOneProductVariant(product_id){
        const variant = await this.productVariantService.findProductVariant({ product_id });
        return {
            variant: variant.variants,
            price: variant.sale_price,
            cost_price: variant.cost_price,
            profit: variant.profit,
            stock: variant.stock,
            image: variant.image
        }
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