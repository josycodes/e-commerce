import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {authorizeRequest} from "../../../middleware/authentication.middleware.js";
import {
    addToCart,
    listCartItems,
    removeCartItem,
    updateCartItem
} from "../../../controllers/user/cart/cart.controller.js";
router.use(authorizeRequest);

router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            product_id: Joi.number().required(),
            product_variant_id: Joi.number().required(),
            quantity: Joi.number().required()
        }),
    }),
    addToCart);

router.get('/list', listCartItems);

router.post('/update/:product_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            product_id: Joi.number().required()
        }),
        [Segments.BODY]: Joi.object({
            type: Joi.string().valid('add', 'remove')
        }),
    }),
    updateCartItem);

router.get('/remove/:product_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            product_id: Joi.number().required()
        })
    }),
    removeCartItem);

export default router;