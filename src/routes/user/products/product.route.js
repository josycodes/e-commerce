import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {filterProducts, getAll, getProduct} from "../../../controllers/user/products/product.controller.js";
import {authorizeRequest} from "../../../middleware/authentication.middleware.js";
router.use(authorizeRequest);

router.get('/all', getAll);

router.get('/id/:product_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            product_id: Joi.number().positive().required()
        }),
    }),
    getProduct);


router.post('/filter',
    celebrate({
        [Segments.BODY]: Joi.object({
            min_price: Joi.number().positive().optional(),
            max_price: Joi.number().positive().optional(),
            collection_id: Joi.array().optional()
        }),
    }),
    filterProducts);

export default router;