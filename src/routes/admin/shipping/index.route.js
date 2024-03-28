import general from "./general/general.route.js";
import rates from "./rates/rates.route.js";
import express from "express";
import {authorizeRequest} from "../../../middleware/authentication.middleware.js";
const router = express.Router();
router.use(authorizeRequest);

router.use('/general', general);
router.use('/rates', rates);

export default router;
