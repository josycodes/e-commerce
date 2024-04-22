import { banners } from "../../../controllers/user/banner/banner.controller.js";
import express from "express";
const router = express.Router();

router.get('/', banners);

export default router;