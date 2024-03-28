import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {createPromotion, getPromotion, updatePromotion} from "../../../controllers/admin/promotion/promotion.route.js";


router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            code: Joi.string(),
            discount_type: Joi.string(),
            amount: Joi.number(),
            minimum_spend: Joi.number(),
            maximum_spend: Joi.number(),
            free_shipping: Joi.boolean(),
            description: Joi.string(),
            commence_date: Joi.date(),
            expiry_date: Joi.date(),
            status:Joi.boolean()
        }),
    }), createPromotion
);

router.get('/:promotion_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            promotion_id: Joi.number()
        }),
    }), getPromotion
);

router.post('/:promotion_id/update',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            promotion_id: Joi.number()
        })
    }),
    celebrate({
        [Segments.BODY]: Joi.object({
            code: Joi.string(),
            discount_type: Joi.string(),
            amount: Joi.number(),
            minimum_spend: Joi.number(),
            maximum_spend: Joi.number(),
            free_shipping: Joi.boolean(),
            description: Joi.string(),
            commence_date: Joi.date(),
            expiry_date: Joi.date(),
            status:Joi.boolean()
        }),
    }), updatePromotion
);

export default router;