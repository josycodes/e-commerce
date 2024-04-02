import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {authorizeRequest} from "../../../middleware/authentication.middleware.js";
import {addToCart} from "../../../controllers/user/cart/cart.controller.js";
router.use(authorizeRequest);

router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            product_id: Joi.number(),
            product_variant_id: Joi.number(),
            quantity: Joi.number()
        }),
    }),
    addToCart);

router.post('/list', listCartItems);

router.post('/:cart_id',
    celebrate({
        [Segments.BODY]: Joi.object({
            min_price: Joi.number().positive().optional(),
            max_price: Joi.number().positive().optional(),
            collection_id: Joi.array().optional()
        }),
    }),
    getCartItem);

router.post('/:cart_id/update',
    celebrate({
        [Segments.BODY]: Joi.object({
            min_price: Joi.number().positive().optional(),
            max_price: Joi.number().positive().optional(),
            collection_id: Joi.array().optional()
        }),
    }),
    updateCartItem);

router.post('/:cart_id/remove',
    celebrate({
        [Segments.BODY]: Joi.object({
            min_price: Joi.number().positive().optional(),
            max_price: Joi.number().positive().optional(),
            collection_id: Joi.array().optional()
        }),
    }),
    removeCartItem);

export default router;