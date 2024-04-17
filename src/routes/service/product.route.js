import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {
    filterProducts,
    getAll,
    getProduct, productReviews, productShipping, productVariants, randomProducts, similarProducts,
    trendingProducts
} from "../../controllers/user/products/product.controller.js";

router.get('/all', getAll);

router.get('/id/:product_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            product_id: Joi.number().positive().required()
        }),
    }),
    getProduct
);

router.get('/similar/:product_id',
    celebrate({
        [Segments.QUERY]: Joi.object({
            limit: Joi.number().positive(),
            page: Joi.number().positive()
        }),
        [Segments.PARAMS]: Joi.object({
            product_id: Joi.number().positive().required()
        }),
    }),
    similarProducts
);


router.post('/filter',
    celebrate({
        [Segments.QUERY]: Joi.object({
            page: Joi.number().positive().default(1),
            limit: Joi.number().positive().default(10).max(100),
        }),
        [Segments.BODY]: Joi.object({
            search:Joi.string().optional(),
            min_price: Joi.number().positive().optional(),
            max_price: Joi.number().positive().optional(),
            category_id: Joi.array().optional(),
            shipping_id: Joi.array().optional(),
            rating: Joi.array().optional(),
            variants: Joi.object().pattern(
                Joi.string(),
                Joi.array().items(Joi.any()) // Specify that values must be arrays
            ).optional()
        }),
    }),
    filterProducts
);


router.get('/filter/trending',  trendingProducts);
router.get('/filter/random',  randomProducts);
router.get('/filter/variants',  productVariants);
router.get('/filter/reviews',  productReviews);
router.get('/filter/shipping',  productShipping);

export default router;