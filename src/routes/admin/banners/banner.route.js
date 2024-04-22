import  { authorizeRequest } from "../../../middleware/authentication.middleware.js";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
import express from "express";
import {
    allBanners,
    updateCategoryBanner, updateCountdownBanner,
    updateMainBanner,
    updateSubBanner
} from "../../../controllers/admin/banners/banner.controller.js";
const router = express.Router();
router.use(authorizeRequest);

router.post('/main', updateMainBanner);
router.post('/sub', updateSubBanner);
router.post('/category', updateCategoryBanner);
router.post('/countdown',
    celebrate({
        [Segments.BODY]: Joi.object({
            main_text: Joi.string().required(),
            caption: Joi.string().required(),
            start_date: Joi.date().required(),
            end_date: Joi.date().required()
        })
    }),
    updateCountdownBanner);

router.get('/all', allBanners);

export default router;