// import { router } from '../../../middleware/app.middleware.js';
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
import { login } from "../../../controllers/admin/auth/auth.controller.js";
import express from "express";

const router = express.Router();

router.post(
    '/login',
    celebrate({
        [Segments.BODY]: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    }),
    login
);

export default router;