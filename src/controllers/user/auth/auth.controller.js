import { BadRequest, NotFound } from "../../../libs/Error.lib";
import ResponseLib from "../../../libs/Response.lib";
import AuthService from "../../../services/auth.service.js";
import {TABLE} from "../../../db/tables.js";
import UserMapper from "../../../mappers/user.mapper.js";

export const login = async (req, res, next) => {
    const authService = new AuthService(TABLE.USER);
    try {
        const { email, password } = req.body;
        const user = await authService.findUserByEmail(email);
        await authService.validateUserPassword(password, user.verification);
        const token = await authService.generateUserToken(user);

        return new ResponseLib(req, res).json({
            status: true,
            message: "Login Successful",
            data: UserMapper.toDTO({ user, token })
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest) {
            return next(new BadRequest('Wrong credentials'))
        }
        next(error)
    }
}
