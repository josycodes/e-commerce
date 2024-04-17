import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {createTax, listTax, searchTax} from "../../../controllers/admin/tax/tax.controller.js";


router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            title: Joi.string().required(),
            tax_type: Joi.string().valid('percentage', 'fixed').required(),
            value: Joi.number().required(),
        }),
    }), createTax
);

router.get('/search',
    celebrate({
        [Segments.BODY]: Joi.object({
            search: Joi.string().required()
        }),
    }), searchTax
);

router.get('/list', listTax);


export default router;