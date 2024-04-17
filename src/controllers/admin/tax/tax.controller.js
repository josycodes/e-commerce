import ResponseLib from "../../../libs/Response.lib.js";
import ErrorLib, {NotFound, BadRequest} from "../../../libs/Error.lib.js";
import TaxService from "../../../services/tax.service.js";

export const createTax = async (req, res, next) => {
    const taxService = new TaxService();
    try{
        const {
            title,
            tax_type,
            value
        } = req.body;

        //create tax
        const tax = await taxService.createTax({
            title,
            tax_type,
            value,
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "Tax created Successfully",
            data: tax
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const searchTax = async (req, res, next) => {
    const taxService = new TaxService();
    try{
        const {
            search
        } = req.body;

        const taxes = await taxService.searchTax({ columnName: 'title', search: `%${search}%`});

        return new ResponseLib(req, res).json({
            status: true,
            message: "Taxes Loaded",
            data: taxes
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const listTax = async (req, res, next) => {
    const taxService = new TaxService();
    try{
        const taxes = await taxService.findAllTaxes();

        return new ResponseLib(req, res).json({
            status: true,
            message: "Taxes Loaded",
            data: taxes
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}