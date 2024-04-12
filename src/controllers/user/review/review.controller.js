import ProductService from "../../../services/product.service.js";
import ErrorLib, { NotFound } from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import OrderService from "../../../services/order.service.js";
import {ORDER_STATUS} from "../../../config/order.js";
import ReviewService from "../../../services/review.service.js";
import ReviewMapper from "../../../mappers/review.mapper.js";

export const addReview = async (req, res, next) => {
    const productService = new ProductService();
    const orderService = new OrderService();
    const reviewService = new ReviewService();
    try{
        const user = req.user;
        const { product_id } = req.params;
        const { rating, review } = req.body;
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not found');

        //check that user has ordered for the product and completed the order
        const orderItemWithProduct = await orderService.findProductFromOrders({user_id: user.id, status: ORDER_STATUS.COMPLETED}, product_id);
        if(orderItemWithProduct){
            //proceed with rating
            const reviewCheck = await reviewService.findReview({user_id: user.id, product_id});
            if(reviewCheck) {
                throw new ErrorLib('Product already rated', 400);
            }else{
                await reviewService.createReview({
                    product_id,
                    user_id: user.id,
                    rating: rating,
                    comment: review
                })
            }
        }else{
            throw new ErrorLib('Can only rate a completed Product Order', 400);
        }

        return new ResponseLib(req, res).json({
            status: true,
            message: "Product Rated Successfully"
        });
    }
    catch (error) {
        next(error)
    }
}

export const getAllUserReviews = async(req, res, next) => {
    const reviewService = new ReviewService();
    try{
        const user = req.user;

        const reviews = await reviewService.findAllReviews({user_id: user.id});
        const reviewsDTO = await Promise.all(reviews.map(async (review) => {
            return await ReviewMapper.productToDTO({...review}, user);
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Reviews Loaded",
            data: reviewsDTO
        });
    }
    catch (error) {
        next(error)
    }
}
