import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import { createGeneralShipping } from "../../../../controllers/admin/shipping/general/general.controller.js";


router.post('/',
    celebrate({
        [Segments.BODY]: Joi.object({
            store_address: Joi.string(),
            store_country: Joi.string(),
            store_state: Joi.string(),
            store_city: Joi.string(),
            store_address_zip_code: Joi.string().optional(),
            taxes: Joi.boolean(),
            payment_on_delivery: Joi.boolean(),
            discount: Joi.boolean(),
            sales_location: Joi.array().items({
                country_id: Joi.number(),
                country: Joi.string(),
                postal_code: Joi.string()
            })
        }),
    }), createGeneralShipping
);

export default router;