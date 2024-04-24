import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
import {
    addShippingMethod,
    listMethods,
    updateShippingConditions,
    updateShippingStatus
} from "../../../../controllers/admin/shipping/method/method.controller.js";
import {SHIPPING_CONDITIONS, SHIPPING_CONDITIONS_SIGN, SHIPPING_METHODS} from "../../../../config/shipping_method.js";

const router = express.Router();

router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            method_type: Joi.string().valid(SHIPPING_METHODS.FLAT_RATE, SHIPPING_METHODS.FREE_SHIPPING, SHIPPING_METHODS.LOCATION_BASED),
            description: Joi.string().required(),
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

router.post('/update/:shipping_method_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            shipping_method_id: Joi.number()
        })}),
    celebrate({
        [Segments.BODY]: Joi.object({
            conditions: Joi.array().items({
                charge: Joi.number().required(),
                condition: Joi.string().valid(SHIPPING_CONDITIONS.EQUALS,SHIPPING_CONDITIONS.LESS_THAN_EQUALS_TO,SHIPPING_CONDITIONS.GREATER_THAN,SHIPPING_CONDITIONS.LESS_THAN,SHIPPING_CONDITIONS.GREATER_THAN_EQUALS_TO).required(),
                condition_sign: Joi.string().valid().required()
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
        }),
    }), updateShippingConditions
);

router.post('/update/status/:shipping_method_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            shipping_method_id: Joi.number()
        })}),
    celebrate({
        [Segments.BODY]: Joi.object({
            status: Joi.boolean().required()
        }),
    }), updateShippingStatus
);

router.get('/list', listMethods);

export default router;