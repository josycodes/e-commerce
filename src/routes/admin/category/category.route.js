import  { authorizeRequest } from "../../../middleware/authentication.middleware.js";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
import { create } from "../../../controllers/admin/category/category.controller.js";
import express from "express";
const router = express.Router();
// router.use(authorizeRequest);

router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required()
        })
    }),
    create
);

export default router;