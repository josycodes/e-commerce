import general from "./general/general.route.js";
import method from "./method/method.route.js";
import express from "express";
import {authorizeRequest} from "../../../middleware/authentication.middleware.js";
const router = express.Router();
router.use(authorizeRequest);

router.use('/general', general);
router.use('/method', method);

export default router;
