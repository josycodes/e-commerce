import  { authorizeRequest } from "../../../middleware/authentication.middleware.js";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
import {create, edit, getAll, remove} from "../../../controllers/admin/category/category.controller.js";
import express from "express";
const router = express.Router();

router.use(authorizeRequest);

//Create Category
router.post(
    '/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            slug: Joi.string().optional(),
            description: Joi.string().optional(),
            status: Joi.boolean().optional()
        })
    }),
    create
);

//Get All Category
router.get('/all', getAll);

//Edit Category
router.post('/edit/:category_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            collection_id: Joi.number().positive().required()
        }),
    }),
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            slug: Joi.string().required(),
            description: Joi.string().required()
        })
    }),
    edit
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