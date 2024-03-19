//Get All Collections
import express from "express";
const router = express.Router();
import {getAll} from "../../../controllers/user/collections/collection.controller.js";
import {authorizeRequest} from "../../../middleware/authentication.middleware.js";

router.use(authorizeRequest);

router.get('/all', getAll);

export default router;