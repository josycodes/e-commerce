import  { authorizeRequest } from "../../../middleware/authentication.middleware.js";
import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();

import { create, getProduct, getAll, filterProducts } from "../../../controllers/admin/products/product.controller.js";

router.use(authorizeRequest);

//Create Product
router.post('/add', create);

router.get('/id/:product_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            product_id: Joi.number().positive().required()
        }),
    }),
    getProduct);

router.get('/all', getAll);

router.post('/filter',
    celebrate({
        [Segments.BODY]: Joi.object({
            min_price: Joi.number().positive().optional(),
            max_price: Joi.number().positive().optional(),
            category_id: Joi.array().optional(),
            published_status: Joi.boolean().optional()
        }),
    }),
    filterProducts);

export default router;