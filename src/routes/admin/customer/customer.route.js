import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {allCustomers, createCustomer, getCustomer} from "../../../controllers/admin/customer/customer.controller.js"


router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string(),
            email: Joi.string()
        }),
    }), createCustomer
);

router.get('/get/:customer_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            customer_id: Joi.number()
        })
    }), getCustomer
);

router.get('/all', allCustomers);

export default router;