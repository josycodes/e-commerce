import LoggerLib from "../libs/Logger.lib.js";
import DBAdapter from "../db/DBAdapter.js";
import { TABLE } from "../db/tables.js";

export default class UserService{
    constructor() {
        this.dbInstance = new DBAdapter();
        this.table = TABLE.USER
    }

    async createUser(options){
        return await this.dbInstance.createAndFetch(this.table, options);
    }

    async findUser(options){
        return await this.dbInstance.findOne(this.table, options);
    }

    async findAllUsers(options = {}){
        return await this.dbInstance.findAll(this.table, options);
    }

    async findAllUsersCount(options = {}){
        return await this.dbInstance.findAndCount(this.table, options);
    }
}