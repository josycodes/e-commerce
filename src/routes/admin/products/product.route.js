import  { authorizeRequest } from "../../../middleware/authentication.middleware.js";
import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();

import { create, getProduct, getAll } from "../../../controllers/admin/products/product.controller.js";

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

export default router;