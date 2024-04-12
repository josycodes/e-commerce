import ProductService from "../services/product.service.js";
import OrderItemService from "../services/order_item.service.js";
import ProductDiscountService from "../services/product_discount.service.js";
import DiscountService from "../services/discount.service.js";
import ReviewMapper from "./review.mapper.js";
import ReviewService from "../services/review.service.js";
import ShippingMethodService from "../services/shipping_method.service.js";

export default class ProductMapper {
    static async toDTO(data) {
        const productService = new ProductService();
        const orderItemService = new OrderItemService();

        const variants = await productService.productVariants(data.id);
        const total_stock = await productService.productVariantTotalStock(data.id);

        const orderItems = await orderItemService.getOrderItems({ product_id: data.id });
        let totalSalePrice = 0;
        let latestOrderItem = null;
        if(orderItems.length > 0){
            const updatedOrderItems = orderItems.map(orderItem => {
                // Calculate the sale price by multiplying the amount with the quantity
                const salePrice = Number(orderItem.amount) * orderItem.quantity;
                return {
                    ...orderItem,
                    sale_price: salePrice
                };
            });

            totalSalePrice = updatedOrderItems.reduce((total, orderItem) => {
                return total + orderItem.sale_price;
            }, 0);

            const validOrderItems = orderItems.filter(item => item.created_at);

            if (validOrderItems.length > 0) {
                // Sort the valid orderItems array based on the created_at date in descending order
                validOrderItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                // Get the orderItem with the latest created_at date (first item in the sorted array)
                latestOrderItem = validOrderItems[0].created_at;
            }
        }

        return {
            product: {
                id: data.id,
                name: data.name,
                description: data.description,
                published: data.published,
                images: data.images,
                sku: data.sku,
                tags: data.tags,
                measuring_unit: data.measuring_unit,
                variants,
                total_stock,
                quantity_sold: orderItems.length,
                revenue: totalSalePrice,
                last_sold_at: latestOrderItem,
                created_at: data.created_at,
                updated_at: data.updated_at
            }
        };
    }

    static async dataDTO(data) {
        const productService = new ProductService();
        const total_stock = await productService.productTotalStock(data.id);
        return {
            product: {
                id: data.id,
                name: data.name,
                description: data.description,
                images: data.images,
                published: data.published,
                total_stock,
                created_at: data.created_at
            }
        };
    }

    static async userdataDTO(data, reviews = true) {
        const productService = new ProductService();
        const productDiscountService = new ProductDiscountService();
        const discountService = new DiscountService();
        const reviewService = new ReviewService();
        const shippingService = new ShippingMethodService();

        const total_stock = await productService.productTotalStock(data.id);
        const variants = await productService.productVariants(data.id);
        const orderItemService = new OrderItemService();
        const orderItems = await orderItemService.getOrderItems({ product_id: data.id });

        const discount_products = await productDiscountService.getAllProductDiscounts({product_id: data.id});
        const discountsIds = discount_products.map(discount_product => discount_product.discount_id);
        const discounts = await discountService.findAllDiscountsWhereIn('id', discountsIds);

        //Shipping for product
        const shipping = await shippingService.findShippingMethod({id: data.shipping_id});
        console.log('////////////////////////', shipping);
        let shipping_conditions = null;
        if(shipping){
            shipping_conditions = await shippingService.getShippingMethodConditions(shipping.type, {shipping_method_id: shipping.id});
        }

        let reviewsDTO = null;
        if(reviews){
            const reviews = await reviewService.findAllReviews({product_id: data.id});
            reviewsDTO = await Promise.all(reviews.map(async (review) => {
                return await ReviewMapper.userToDTO({...review});
            }));

            // Calculate total rating and count of reviews using reduce
            const { totalRating, reviewCount, ratingCounts } = reviews.reduce((accumulator, review) => {
                // Add rating to totalRating
                accumulator.totalRating += review.rating;
                // Increment the count for the corresponding rating
                accumulator.ratingCounts[review.rating]++;
                // Increment review count
                accumulator.reviewCount++;
                return accumulator;
            }, { totalRating: 0, reviewCount: 0, ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
            // Calculate the average rating
            const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

            return {
                product: {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    published: data.published,
                    images: data.images,
                    sku: data.sku,
                    tags: data.tags,
                    measuring_unit: data.measuring_unit,
                    variants,
                    total_stock,
                    quantity_sold: orderItems.length,
                    created_at: data.created_at,
                    discount: discounts,
                    reviews: reviewsDTO,
                    rating_analytics: {
                        averageRating,
                        total_ratings: reviewsDTO.length,
                        ratingCounts
                    },
                    shipping:{
                        shipping,
                        shipping_conditions
                    }
                }
            };
        }else{
            return {
                product: {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    published: data.published,
                    images: data.images,
                    sku: data.sku,
                    tags: data.tags,
                    measuring_unit: data.measuring_unit,
                    variants,
                    total_stock,
                    quantity_sold: orderItems.length,
                    created_at: data.created_at,
                    discount: discounts,
                    reviews: reviewsDTO,
                    rating_analytics: {
                        averageRating:null,
                        ratingCounts: null
                    },
                    shipping:{
                        shipping,
                        shipping_conditions
                    }
                }
            };
        }


    }
}
