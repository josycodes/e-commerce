import { router } from '../../../middleware/app.middleware.js';
import  { authorizeRequest } from "../../../middleware/authentication.middleware.js";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
import { create, all } from "../../../controllers/admin/variants/variant.controller.js";

router.use(authorizeRequest);

router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            type: Joi.string().required(),
            value: Joi.string().required(),
            category_id: Joi.number().optional()
        })
    }),
    create
);

router.get('/all/:category_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            category_id: Joi.number().positive().required()
        }),
    }),
    all
);


export default router;