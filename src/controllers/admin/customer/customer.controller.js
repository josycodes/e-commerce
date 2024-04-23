import ErrorLib, { BadRequest, NotFound } from "../../../libs/Error.lib.js";
import UserService from "../../../services/user.service.js";
import UserMapper from "../../../mappers/user.mapper.js";
import ResponseLib from "../../../libs/Response.lib.js";
import CustomerMapper from "../../../mappers/customer.mapper.js";
import ProductMapper from "../../../mappers/product.mapper.js";

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

export const allCustomers = async (req, res, next) => {
    const userService = new UserService();
    try{
        const customers = await userService.findAllUsers();
        const active_customers = await userService.findAllUsersCount({status: 'active'});
        const inactive_customers = await userService.findAllUsersCount({status: 'deactivated'});

        const customersDTO = await Promise.all(customers.map(async (customer) => {
            return await CustomerMapper.toDTO({...customer});
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Customers Loaded Successfully",
            data: customersDTO,
            all_customers: customersDTO.length,
            active_customers: parseInt(active_customers[0].count),
            inactive_customers: parseInt(inactive_customers[0].count),
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}


export const getCustomer = async (req, res, next) => {
    const userService = new UserService();
    try{
        const { customer_id } = req.params;

        const customer = await userService.findUser({
            id: customer_id
        });
        if(!customer) throw new BadRequest('Customer not Found');

        const customerDTO = await CustomerMapper.toDTOUser({...customer});

        return new ResponseLib(req, res).json({
            status: true,
            message: "Customer Loaded Successfully",
            data: customerDTO
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}