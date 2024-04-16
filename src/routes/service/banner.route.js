import { banners } from "../../controllers/service/banner.controller.js";
import express from "express";
const router = express.Router();

router.get('/banners', banners );

export default router;