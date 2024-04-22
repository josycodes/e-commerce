import ProductService from "../services/product.service.js";
import OrderItemService from "../services/order_item.service.js";
import ReviewMapper from "./review.mapper.js";
import ProductDiscountService from "../services/product_discount.service.js";
import DiscountService from "../services/discount.service.js";
import ReviewService from "../services/review.service.js";
import DiscountMapper from "./discount.mapper.js";

export default class RecentlyViewMapper {
    static async dataDTO(data) {
        const productService = new ProductService();
        const productDiscountService = new ProductDiscountService();
        const discountService = new DiscountService();
        const reviewService = new ReviewService();

        const total_stock = await productService.productTotalStock(data.product_id);
        const product = await productService.findProduct({id: data.product_id});
        const variants = await productService.productVariantsUser(data.id);

        const orderItemService = new OrderItemService();
        const orderItems = await orderItemService.getOrderItems({ product_id: product.id });

        const discount_products = await productDiscountService.getAllProductDiscounts({product_id: product.id});
        const discountsIds = discount_products.map(discount_product => discount_product.discount_id);
        const discounts = await discountService.findAllDiscountsWhereIn('id', discountsIds);
        const discountDTO = await Promise.all(discounts.map(async (discount) => {
            return DiscountMapper.toUserDTO({...discount});
        }));

        let reviewsDTO = null;

        const reviews = await reviewService.findAllReviews({product_id: product.id});
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
            quantity: data.quantity,
            product: {
                id: product.id,
                name: product.name,
                description: product.description,
                published: product.published,
                images: product.images,
                sku: product.sku,
                tags: product.tags,
                measuring_unit: product.measuring_unit,
                total_stock,
                variants,
                quantity_sold: orderItems.length,
                created_at: data.created_at,
                discount: discountDTO,
                reviews: reviewsDTO,
                rating_analytics: {
                    averageRating,
                    total_ratings: reviewsDTO.length,
                    ratingCounts
                }
            }
        };
    }
}
