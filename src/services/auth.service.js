import DBAdapter from "../db/DBAdapter.js";
import bcrypt from 'bcryptjs';
import {BadRequest} from '../libs/Error.lib.js';
import jwt from "jsonwebtoken";
import LoggerLib from "../libs/Logger.lib.js";

export default class AdminService{
    constructor(table) {
        this.dbInstance = new DBAdapter();
        this.table = table
    }

    async findUserByEmail(email){
        const user = await this.dbInstance.findOne(this.table, {
            email: email
        });
        LoggerLib.log('User', {user});
        if (!user) throw new BadRequest('User does not exist.')
        return user;
    }

    async validateUserPassword(password, passwordCrypt) {
        const matches =  bcrypt.compareSync(password, passwordCrypt);
        if (!matches) throw new BadRequest('Wrong Credentials.')
        return matches;
    }

    async generateUserToken(user) {
        return jwt.sign({id: user.id}, process.env.JWT_SECRET, {
            expiresIn: 60*24
        });
    }
}