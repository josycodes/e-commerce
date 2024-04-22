import { countries } from "../../controllers/service/country.controller.js";
import product from "./product.route.js";
import banner from "./banner.route.js";
import express from "express";
const router = express.Router();

router.use('/product', product);
router.use('/banners', banner);
router.get('/countries', countries );

export default router;