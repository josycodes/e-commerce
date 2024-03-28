import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import { createGeneralShipping } from "../../../../controllers/admin/shipping/general/general.controller.js";


router.post('/',
    celebrate({
        [Segments.BODY]: Joi.object({
            shipping_sales_location_option: Joi.string(),
            customer_location: Joi.string(),
            taxes: Joi.boolean(),
            promotional_codes: Joi.boolean(),
            store_address: Joi.string(),
            store_address_postal_code: Joi.string().optional(),
            sales_location: Joi.array().items({
                country: Joi.string(),
                postal_code: Joi.string()
            })
        }),
    }), createGeneralShipping
);

export default router;