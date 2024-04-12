import  { authorizeRequest } from "../../../middleware/authentication.middleware.js";
import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();

import {
    create,
    getProduct,
    getAll,
    filterProducts,
    updateProductStatus, restockProduct, adjustStockProduct
} from "../../../controllers/admin/products/product.controller.js";

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
            search:Joi.string().optional(),
            min_price: Joi.number().positive().optional(),
            max_price: Joi.number().positive().optional(),
            category_id: Joi.array().optional(),
            published_status: Joi.boolean().optional()
        }),
    }),
    filterProducts);

router.post('/update/status/:product_id',
    celebrate({
        [Segments.PARAMS]:{
            product_id: Joi.number()
        },
        [Segments.BODY]: Joi.object({
            published_status: Joi.boolean().required(),
        })
    }),
    updateProductStatus);

router.post('/update/restock/inventory/:product_id',
    celebrate({
        [Segments.PARAMS]:{
            product_id: Joi.number()
        },
        [Segments.BODY]: Joi.object({
            variant_id: Joi.number().required(),
            restock_quantity: Joi.number().required(),
            note: Joi.string().optional()
        })
    }),
    restockProduct);

router.post('/update/adjust/inventory/:product_id',
    celebrate({
        [Segments.PARAMS]:{
            product_id: Joi.number()
        },
        [Segments.BODY]: Joi.object({
            variant_id: Joi.number().required(),
            new_quantity: Joi.number().required(),
            note: Joi.string().optional()
        })
    }),
    adjustStockProduct);

export default router;