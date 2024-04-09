import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
import { addShippingMethod, listMethods } from "../../../../controllers/admin/shipping/method/method.controller.js";
import {SHIPPING_CONDITIONS, SHIPPING_CONDITIONS_SIGN, SHIPPING_METHODS} from "../../../../config/shipping_method.js";

const router = express.Router();

router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string(),
            method_type: Joi.string().valid(SHIPPING_METHODS.FLAT_RATE, SHIPPING_METHODS.FREE_SHIPPING, SHIPPING_METHODS.LOCATION_BASED),
            description: Joi.string(),
            status: Joi.boolean().default('true'),
            conditions: Joi.array().when('method_type', {
                is: (SHIPPING_METHODS.FLAT_RATE || SHIPPING_METHODS.LOCATION_BASED),
                then: Joi.array().items({
                    charge: Joi.number(),
                    condition: Joi.string().valid(SHIPPING_CONDITIONS.EQUALS,SHIPPING_CONDITIONS.LESS_THAN_EQUALS_TO,SHIPPING_CONDITIONS.GREATER_THAN,SHIPPING_CONDITIONS.LESS_THAN,SHIPPING_CONDITIONS.GREATER_THAN_EQUALS_TO),
                    condition_sign: Joi.string().valid()
                        .when('condition', {
                            is: SHIPPING_CONDITIONS.EQUALS,
                            then: Joi.string().valid(SHIPPING_CONDITIONS_SIGN.EQUALS)
                        })
                        .when('condition', {
                            is: SHIPPING_CONDITIONS.LESS_THAN_EQUALS_TO,
                            then: Joi.string().valid(SHIPPING_CONDITIONS_SIGN.LESS_THAN_EQUALS_TO)
                        })
                        .when('condition', {
                            is: SHIPPING_CONDITIONS.GREATER_THAN,
                            then: Joi.string().valid(SHIPPING_CONDITIONS_SIGN.GREATER_THAN)
                        })
                        .when('condition', {
                            is: SHIPPING_CONDITIONS.LESS_THAN,
                            then: Joi.string().valid(SHIPPING_CONDITIONS_SIGN.LESS_THAN)
                        })
                        .when('condition', {
                            is: SHIPPING_CONDITIONS.GREATER_THAN_EQUALS_TO,
                            then: Joi.string().valid(SHIPPING_CONDITIONS_SIGN.GREATER_THAN_EQUALS_TO)
                        }),
                    count: Joi.number()
                }).required()
            })
        }),
    }), addShippingMethod
);

router.get('/list', listMethods);

export default router;