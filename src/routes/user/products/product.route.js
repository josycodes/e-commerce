import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {
    filterProducts,
    getAll,
    getProduct, productReviews, productShipping, productVariants, randomProducts,
    trendingProducts
} from "../../../controllers/user/products/product.controller.js";
import {authorizeRequest} from "../../../middleware/authentication.middleware.js";
router.use(authorizeRequest);

router.get('/all', getAll);

router.get('/id/:product_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            product_id: Joi.number().positive().required()
        }),
    }),
    getProduct);


router.post('/filter',
    celebrate({
        [Segments.BODY]: Joi.object({
            search:Joi.string().optional(),
            min_price: Joi.number().positive().optional(),
            max_price: Joi.number().positive().optional(),
            category_id: Joi.array().optional()
        }),
    }),
    filterProducts);


router.get('/filter/trending',  trendingProducts);
router.get('/filter/random',  randomProducts);
router.get('/filter/variants',  productVariants);
router.get('/filter/reviews',  productReviews);
router.get('/filter/shipping',  productShipping);

export default router;