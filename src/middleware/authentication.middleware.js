import ErrorLib, { NotFound } from "../libs/Error.lib.js";
import AuthService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import {TABLE} from "../db/tables.js";

export const authorizeRequest = async (req, res, next) => {
    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0].toLowerCase() !== 'bearer'
        ) {
            throw new Error('unauthorized');
        }
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) throw new ErrorLib('unauthorized', 401)
        const { id: id, scope: scope } = jwt.verify(token, process.env.JWT_TOKEN);
        if (!scope || (scope !== "user" && scope !== "admin")) {
            throw new ErrorLib('forbidden', 403)
        }

        let auth;
        if(scope === 'user'){
            auth = new AuthService(TABLE.USER);
        }else{
            auth = new AuthService(TABLE.ADMIN);
        }

        req.user = await auth.findUserById(id);
        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof NotFound) {
            next(new ErrorLib('unauthorized', 401))
        } else {
            next(error)
        }
    }
}