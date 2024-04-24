import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {
    createGeneralShipping,
    getGeneralShipping
} from "../../../../controllers/admin/shipping/general/general.controller.js";


router.post('/',
    celebrate({
        [Segments.BODY]: Joi.object({
            store_address: Joi.string(),
            country_id: Joi.number().optional().default(null),
            country: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
            zip_code: Joi.string().optional().default(null),
            taxes: Joi.boolean(),
            payment_on_delivery: Joi.boolean(),
            discount: Joi.boolean(),
            sales_location: Joi.array().items({
                country_id: Joi.number().optional().default(null),
                country: Joi.string().required(),
                zip_code: Joi.string().optional().default(null)
            })
        }),
    }), createGeneralShipping
);

router.get('/', getGeneralShipping);

export default router;