import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";
import ProductDiscountService from "./product_discount.service.js";
import ProductService from "./product.service.js";
import OrderItemService from "./order_item.service.js";

export default class DiscountService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.DISCOUNT;
        this.product_discountService = new ProductDiscountService();
        this.productService = new ProductService();
        this.orderItemService = new OrderItemService();
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

    async getDiscountedProducts(options) {
        const discount = await this.getDiscount(options);
        const discountedProducts = await this.product_discountService.getAllProductDiscounts({ discount_id: discount.id });
        if(!discountedProducts){
            return null
        }
        return await Promise.all(discountedProducts.map(async discountedProduct => {
            const product = await this.productService.findProduct({id: discountedProduct.product_id});
            const firstProductVariant = await this.productService.findOneProductVariant(product.id);
            console.log(']]]]]]]]]]]]]]]]]]]]]]]]]]]]', firstProductVariant)
            const orderItems = await this.orderItemService.getOrderItems({product_id: product.id});

            let price_after;
            if (discount.discount_type === 'fixed') {
                price_after = firstProductVariant.price - discount.value;
            } else {
                price_after = firstProductVariant.price - ((discount.value / 100) * firstProductVariant.price);
            }

            const redemption_count = orderItems.length;
            const redemption_value = orderItems.reduce((acc, orderItem) => acc + orderItem.amount, 0);

            return {
                product: product,
                price: firstProductVariant.price,
                price_after: parseInt(price_after),
                redemption_count,
                redemption_value: parseInt(redemption_value)
            };
        }));
    }
}