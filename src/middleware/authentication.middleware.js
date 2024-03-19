import ErrorLib, { NotFound } from "../libs/Error.lib.js";
import AuthService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import {TABLE} from "../db/tables.js";
import {log} from "debug";

export const authorizeRequest = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')){
            throw new Error('unauthorized');
        }else{
            const token = authHeader.split(' ')[1]
            if (!token) throw new ErrorLib('Token not Provided', 401)
            const { id: id, scope: scope } = jwt.verify(token, process.env.JWT_SECRET);
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
        }

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof NotFound) {
            next(new ErrorLib(error.message, 401))
        } else {
            next(error)
        }
    }
}