import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {filterProducts, getAll, getProduct} from "../../../controllers/user/products/product.controller.js";
import {authorizeRequest} from "../../../middleware/authentication.middleware.js";
router.use(authorizeRequest);

router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            product_id: Joi.number(),
            variant_id: Joi.number(),
            quantity: Joi.number(),
            amount: Joi.number()
        }),
    }),
    addToCart);

router.post('/list', filterProducts);

router.post('/:cart_id',
    celebrate({
        [Segments.BODY]: Joi.object({
            min_price: Joi.number().positive().optional(),
            max_price: Joi.number().positive().optional(),
            collection_id: Joi.array().optional()
        }),
    }),
    filterProducts);

router.post('/:cart_id/update',
    celebrate({
        [Segments.BODY]: Joi.object({
            min_price: Joi.number().positive().optional(),
            max_price: Joi.number().positive().optional(),
            collection_id: Joi.array().optional()
        }),
    }),
    filterProducts);

router.post('/:cart_id/remove',
    celebrate({
        [Segments.BODY]: Joi.object({
            min_price: Joi.number().positive().optional(),
            max_price: Joi.number().positive().optional(),
            collection_id: Joi.array().optional()
        }),
    }),
    filterProducts);

export default router;