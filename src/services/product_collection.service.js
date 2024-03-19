import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";
import ProductVariantService from "./product_variant.service.js";

export default class ProductCollectionService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.PRODUCT_COLLECTION
    }

    async createProductCollection(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async findProductCollection(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async findProductsCount(options){
        return await this.dbInstance.findAndCount(this.table,options);
    }

    async findTotalStockCollectionProducts(collection_id){
        const productVariantService = new ProductVariantService();
        const product_collections = await this.findProductCollection({collection_id});

        if (product_collections !== undefined) {
            const allProductCollectionVariants = await Promise.all(product_collections.map(async (product_collection) => {
                return await productVariantService.findVariants({product_id: product_collection.product_id});
            }));

            return allProductCollectionVariants.reduce((acc, allProductCollectionVariant) => {
                const stockSum = allProductCollectionVariant.reduce((sum, item) => sum + item.stock, 0);
                return acc + stockSum;
            }, 0);
        }
    }

    async findProductCollectionWhereIn(columnName, data){
        return this.dbInstance.findWhereIn(this.table, columnName, data);
    }
}