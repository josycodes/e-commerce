import { countries } from "../../controllers/service/country.controller.js";
import express from "express";
const router = express.Router();

router.get('/countries', countries );

export default router;