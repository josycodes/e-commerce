import ErrorLib, { BadRequest, NotFound } from "../../../libs/Error.lib.js";
import UserService from "../../../services/user.service.js";
import UserMapper from "../../../mappers/user.mapper.js";
import ResponseLib from "../../../libs/Response.lib.js";

export const createCustomer = async (req, res, next) => {
    const userService = new UserService();
    try{
        const { name, email } = req.body;

        const user_check = await userService.findUser({ email });
        if(user_check) throw new BadRequest('User already exist');

        //create Customer
        const customer = await userService.createUser({
            name: name,
            email: email
        })

        return new ResponseLib(req, res).json({
            status: true,
            message: "General Shipping Updated Successfully",
            data: UserMapper.toDTO(customer)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}