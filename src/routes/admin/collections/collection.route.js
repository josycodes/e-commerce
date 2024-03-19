import  { authorizeRequest } from "../../../middleware/authentication.middleware.js";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
import {create, edit, getAll, remove} from "../../../controllers/admin/collections/collection.controller.js";
import express from "express";
const router = express.Router();

// router.use(authorizeRequest);

//Create Collection
router.post(
    '/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            slug: Joi.string().required(),
            description: Joi.string().required()
        })
    }),
    create
);

//Get All Collections
router.get('/all', getAll);

//Edit Collection
router.post('/edit/:collection_id',
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

//Remove Collection
router.post('/remove/:collection_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            collection_id: Joi.number().positive()
        }),
    }),
    remove
);

export default router;