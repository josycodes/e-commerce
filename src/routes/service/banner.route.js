import {banners, countdownBanner} from "../../controllers/service/banner.controller.js";
import express from "express";
const router = express.Router();

router.get('/', banners);

router.get('/countdown', countdownBanner);

export default router;