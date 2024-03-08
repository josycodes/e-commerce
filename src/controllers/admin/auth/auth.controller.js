import { BadRequest, NotFound } from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import AuthService from "../../../services/auth.service.js";
import {TABLE} from "../../../db/tables.js";
import AdminMapper from "../../../mappers/admin.mapper.js";

export const login = async (req, res, next) => {
    const authService = new AuthService(TABLE.ADMIN);
    try {
        const { email, password } = req.body;
        const user = await authService.findUserByEmail(email);
        await authService.validateUserPassword(password, user.verification);
        const token = await authService.generateUserToken(user);

        return new ResponseLib(req, res).json({
            status: true,
            message: "Login Successful",
            data: AdminMapper.toDTO({ ...user, token })
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest) {
            return next(new BadRequest('Wrong credentials'))
        }
        next(error)
    }
}
