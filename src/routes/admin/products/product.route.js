import { router } from '../../../middleware/app.middleware.js';
import  { authorizeRequest } from "../../../middleware/authentication.middleware.js";
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
//
// router.use(authorizeRequest);
//
// //Create Product
// router.post(
//     '/add',
//     celebrate({
//         [Segments.BODY]: Joi.object({
//             products: Joi.array().items({
//                 name: Joi.string().required(),
//                 description: Joi.string().required(),
//                 variant_ids: Joi.array().required(),
//                 price: Joi.number().positive().default(0).required(),
//                 stock: Joi.number().positive().default(0).required()
//             })
//         })
//     }),
//     create
// );
//
export default router;