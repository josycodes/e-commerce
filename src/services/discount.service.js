import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";
import ProductDiscountService from "./product_discount.service.js";
import ProductService from "./product.service.js";

export default class DiscountService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.DISCOUNT;
        this.product_discountService = new ProductDiscountService();
        this.productService = new ProductService();
    }

    async createDiscount(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async updateDiscount(options, data){
        return await this.dbInstance.update(this.table, options, data);
    }

    async getDiscount(options){
        return await this.dbInstance.findOne(this.table, options);
    }

    async GetDiscountedProducts(options){
        let discounted_products = []
        const discount = this.dbInstance.findOne(this.table, options);

        //get Products
        const productDiscounts = await this.product_discountService.getAllProductDiscounts({discount_id: discount.id});

        productDiscounts.forEach(productDiscount => {
            let product;
            console.log(productDiscount);
            // Perform operations with productDiscount here
            product = this.productService.findProduct({id:productDiscount.product_id});
            {

            }
        });
    }
}