import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {addToRecentlyView, listRecentlyView} from "../../../controllers/user/cart/recently_view.controller.js";
import {authorizeRequest} from "../../../middleware/authentication.middleware.js";
router.use(authorizeRequest);

router.post('/add',
    celebrate({
        [Segments.BODY]: Joi.object({
            product_id: Joi.number().required()
        }),
    }),
    addToRecentlyView);

router.get('/list', listRecentlyView);

export default router;