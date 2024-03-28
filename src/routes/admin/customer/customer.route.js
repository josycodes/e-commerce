import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import { createCustomer } from "../../../controllers/admin/customer/customer.controller.js"


router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string(),
            email: Joi.string()
        }),
    }), createCustomer
);

export default router;