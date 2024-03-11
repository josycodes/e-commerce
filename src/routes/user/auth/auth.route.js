import { router } from '../../../middleware/app.middleware.js';
import {celebrate, Segments} from "celebrate";
import Joi from "joi";
import { register, login } from "../../../controllers/user/auth/auth.controller.js";

router.post(
    '/register',
    celebrate({
        [Segments.BODY]: Joi.object({
            full_name: Joi.string()
                .min(3)
                .regex(/^[a-zA-Z\s]+$/)
                .required()
                .error(
                    new Error("Full name must contain at least 3 alphabetic characters only")
                ),
            phone: Joi.string().required(),
            email: Joi.string()
                .email()
                .required()
                .error(new Error("Email is required and must be valid")),
            password: Joi.string()
                .min(8)
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
                .required()
                .error(
                    new Error(
                        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit"
                    )
                ),
        })
    }),
    register
);

router.post(
    '/login',
    celebrate({
        [Segments.BODY]: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    }),
    login
);

export default router;