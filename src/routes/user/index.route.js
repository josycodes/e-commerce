import auth from "../user/auth/auth.route.js";
import collection from "../user/collections/collection.route.js";
import express from "express";
const router = express.Router();

router.use('/auth', auth);
router.use('/collection', collection);

export default router;
