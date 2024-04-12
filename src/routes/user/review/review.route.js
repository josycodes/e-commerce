import express from "express";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
const router = express.Router();
import {authorizeRequest} from "../../../middleware/authentication.middleware.js";
import {addReview, getAllUserReviews} from "../../../controllers/user/review/review.controller.js";
router.use(authorizeRequest);

router.get('/all', getAllUserReviews);

router.post('/:product_id',
    celebrate({
        [Segments.PARAMS]: Joi.object({
            product_id: Joi.number().positive().required()
        }),
        [Segments.BODY]: Joi.object({
            rating: Joi.number().required(),
            review: Joi.string().optional()
        })
    }),
    addReview);


export default router;