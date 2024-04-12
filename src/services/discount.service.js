import DBAdapter from "../db/DBAdapter.js";
import {TABLE} from "../db/tables.js";
import ProductDiscountService from "./product_discount.service.js";
import ProductService from "./product.service.js";
import OrderItemService from "./order_item.service.js";
import OrderService from "./order.service.js";
import ShippingLocationConditionService from "./shipping_location_condition.service.js";
import ShippingFlatRateConditionService from "./shipping_rate_condition.service.js";
import {SHIPPING_METHODS} from "../config/shipping_method.js";

export default class DiscountService {
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.DISCOUNT;
        this.product_discountService = new ProductDiscountService();
        this.productService = new ProductService();
        this.orderItemService = new OrderItemService();
        this.orderService = new OrderService();
        this.shippingLocationCondition = new ShippingLocationConditionService()
        this.shippingRateCondition = new ShippingFlatRateConditionService()
    }

    async createDiscount(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async updateDiscount(options, data){
        return await this.dbInstance.update(this.table, options, data);
    }

    async findAllDiscountsWhereIn(columnName, data){
        return await this.dbInstance.findWhereIn(this.table, columnName, data);
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

        //get the product variants with the discount price for all discounted product
        return await Promise.all(discountedProducts.map(async discountedProduct => {
            const product = await this.productService.findProduct({id: discountedProduct.product_id});
            const firstProductVariant = await this.productService.findOneProductVariant(product.id);

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

    async getDiscountedProduct(discount, product) {
        //check if it is actually a discounted product or return null
        const discountedProduct = await this.product_discountService.getAllProductDiscount({ discount_id: discount.id, product_id: product.id });
        if(!discountedProduct){
            return null
        }

        const orderItems = await this.orderItemService.getOrderItems({product_id: product.id});

        //Get Order Customers
        const customer_breakdown = await Promise.all(orderItems.map(async orderItem => {
            //get Customer
           const customer =  await this.orderService.GetOrderCustomer(orderItem.order_id);
           return {
               customer_name: customer.name,
               customer_email: customer.email,
               quantity: orderItem.quantity,
               discount_value: orderItem.amount,
               order_date: orderItem.created_at
            }
        }));

        const redemption_count = orderItems.length;
        const redemption_value = orderItems.reduce((acc, orderItem) => acc + orderItem.amount, 0);

        return {
            redemption_value: parseInt(redemption_value),
            redemption_count,
            customer_count: customer_breakdown.length,
            customers: customer_breakdown
        };
    }
}