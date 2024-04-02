import ErrorLib, { BadRequest, NotFound } from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import AuthService from "../../../services/auth.service.js";
import UserService from "../../../services/user.service.js";
import {TABLE} from "../../../db/tables.js";
import UserMapper from "../../../mappers/user.mapper.js";
import StripeIntegration from "../../../integrations/stripe.integration.js";
// const bcrypt = require("bcryptjs");
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
    const authService = new AuthService(TABLE.USER);
    const userService = new UserService();
    const Stripe = new StripeIntegration();
    try{
        const { full_name, email,phone, password } = req.body;

        //find User
        const user = await authService.findUserByEmail(email);
        const userWithPhone = await userService.findUser({phone});
        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, salt);
        if(user || userWithPhone){
            throw new ErrorLib('User already exists', 400);
        }else{
            // create User on Stripe
            const stripeCreatedUser = await Stripe.createCustomer({
                name: full_name,
                email,
                phone,
            });
            if(stripeCreatedUser){
                const createdUser = await userService.createUser({
                    name: stripeCreatedUser.name,
                    email: stripeCreatedUser.email,
                    phone: stripeCreatedUser.phone,
                    verification: hash_password,
                    stripe_customer_id: stripeCreatedUser.id
                });

                return new ResponseLib(req, res).json({
                    status: true,
                    message: "Registration Successful",
                    data: UserMapper.toDTO(createdUser)
                });
            }else{
                throw new ErrorLib('Stripe Registration');
            }
        }
    }
    catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    const authService = new AuthService(TABLE.USER);
    try {
        const { email, password } = req.body;
        const user = await authService.findUserByEmail(email);
        if(!user) throw BadRequest('User not found')
        await authService.validateUserPassword(password, user.verification);
        const token = await authService.generateUserToken(user);

        return new ResponseLib(req, res).json({
            status: true,
            message: "Login Successful",
            data: UserMapper.toDTO({ ...user, token })
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest) {
            return next(new BadRequest('Wrong credentials'))
        }
        next(error)
    }
}
