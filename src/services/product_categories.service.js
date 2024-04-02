import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";
import ProductVariantService from "./product_variant.service.js";

export default class ProductCategoriesService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.PRODUCT_CATEGORIES
    }

    async createProductCategory(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async findProductCategory(options){
        return await this.dbInstance.findAll(this.table, options);
    }

    async findProductsCount(options){
        return await this.dbInstance.findAndCount(this.table,options);
    }

    async findTotalStockCollectionProducts(category_id){
        const productVariantService = new ProductVariantService();
        const product_categories = await this.findProductCategory({category_id});

        if (product_categories !== undefined) {
            const allProductCategoriesVariants = await Promise.all(product_categories.map(async (product_category) => {
                return await productVariantService.findVariants({product_id: product_category.product_id});
            }));

            return allProductCategoriesVariants.reduce((acc, allProductCategoryVariant) => {
                const stockSum = allProductCategoryVariant.reduce((sum, item) => sum + item.stock, 0);
                return acc + stockSum;
            }, 0);
        }
    }

    async findProductsCategoryWhereIn(columnName, data){
        return this.dbInstance.findWhereIn(this.table, columnName, data);
    }
}