import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {createDiscount, getDiscount, getDiscountedProduct, updateDiscount, addProducts} from "../../../controllers/admin/discount/discount.controller.js";


router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            title: Joi.string(),
            code: Joi.string().optional(),
            discount_type: Joi.string(),
            value: Joi.number(),
            minimum_order_amount: Joi.number(),
            maximum_customer_use: Joi.number(),
            maximum_claims: Joi.number(),
            description: Joi.string().optional(),
            start_date: Joi.date(),
            end_date: Joi.date(),
            status:Joi.boolean().default(true).optional()
        }),
    }), createDiscount
);

router.get('/:discount_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            discount_id: Joi.number()
        }),
    }), getDiscount
);

router.get('/:discount_id/product/:product_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            discount_id: Joi.number(),
            product_id: Joi.number()
        }),
    }), getDiscountedProduct
);


router.post('/:discount_id/update',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            discount_id: Joi.number()
        })
    }),
    celebrate({
        [Segments.BODY]: Joi.object({
            title: Joi.string().optional(),
            code: Joi.string().optional(),
            discount_type: Joi.string().optional(),
            value: Joi.number().optional(),
            minimum_order_amount: Joi.number().optional(),
            maximum_customer_use: Joi.number().optional(),
            maximum_claims: Joi.number().optional(),
            description: Joi.string().optional(),
            start_date: Joi.date().optional(),
            end_date: Joi.date().optional(),
            status:Joi.boolean().default(true).optional()
        }),
    }), updateDiscount
);

router.post('/:discount_id/products',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            discount_id: Joi.number()
        })
    }),
    celebrate({
        [Segments.BODY]: Joi.object({
            product_id: Joi.array().required(),
        }),
    }), addProducts
);

export default router;