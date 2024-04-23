import  { authorizeRequest } from "../../../middleware/authentication.middleware.js";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
import {create, edit, getAll, getCategory, remove} from "../../../controllers/admin/category/category.controller.js";
import express from "express";
const router = express.Router();

router.use(authorizeRequest);

//Create Category
router.post('/add', create);

//Get All Category
router.get('/all', getAll);

//Edit Category
router.post('/edit/:category_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            category_id: Joi.number().positive().required()
        }),
    }),
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().optional(),
            slug: Joi.string().optional(),
            description: Joi.string().optional()
        })
    }),
    edit
);

//Get Category
router.get('/get/:category_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            category_id: Joi.number().positive().required()
        }),
    }),
    getCategory
);

//Remove Category
router.post('/remove/:category_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            collection_id: Joi.number().positive()
        }),
    }),
    remove
);

export default router;