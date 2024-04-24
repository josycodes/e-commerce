import express from "express";
const router = express.Router();
import {getAll, getCategory, getCategoryBySlug} from "../../controllers/user/categories/category.controller.js";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";

router.get('/all', getAll);

//Get Category
router.get('/get/:category_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            category_id: Joi.number().positive().required()
        }),
    }),
    getCategory
);

//Get Category
router.get('/get/:category_slug',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            category_slug: Joi.string().required()
        }),
    }),
    getCategoryBySlug
);


export default router;