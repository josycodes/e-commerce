import express from "express";
const router = express.Router();
import { getAll } from "../../controllers/user/categories/category.controller.js";

router.get('/all', getAll);

export default router;