import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import { createGeneralShipping } from "../../../../controllers/admin/shipping/general/general.controller.js";


router.post('/',
    celebrate({
        [Segments.BODY]: Joi.object({
            store_address: Joi.string(),
            country_id: Joi.number(),
            country: Joi.string(),
            state: Joi.string(),
            city: Joi.string(),
            zip_code: Joi.string().optional(),
            taxes: Joi.boolean(),
            payment_on_delivery: Joi.boolean(),
            discount: Joi.boolean(),
            sales_location: Joi.array().items({
                country_id: Joi.number().optional(),
                country: Joi.string().optional(),
                zip_code: Joi.string().optional()
            })
        }),
    }), createGeneralShipping
);

export default router;