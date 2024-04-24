import ErrorLib, { BadRequest, NotFound } from "../../../../libs/Error.lib.js";
import GeneralShippingService from "../../../../services/general_shipping.service.js";
import SalesLocationService from "../../../../services/sales_location.service.js";
import ResponseLib from "../../../../libs/Response.lib.js";
import GeneralShippingMapper from "../../../../mappers/general_shipping.mapper.js";

export const createGeneralShipping = async (req, res, next) => {
    const generalShippingService = new GeneralShippingService();
    const salesLocationService = new SalesLocationService();
    try{
        const {
            store_address,
            country_id,
            country,
            state,
            city,
            zip_code,
            taxes,
            payment_on_delivery,
            discount,
            sales_location
        } = req.body;

        //create General Shipping Service
        const general_shipping = await generalShippingService.updateShippingService({
            store_address,
            country_id,
            country,
            state,
            city,
            zip_code,
            taxes,
            payment_on_delivery,
            discount
        });

        // Create Sales Location
        await Promise.all(sales_location.map(async (sale_location) => {
            await salesLocationService.createSalesLocation({
                country_id: sale_location.country_id,
                country: sale_location.country,
                zip_code: sale_location.zip_code
            })
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "General Shipping Updated Successfully",
            data: await GeneralShippingMapper.toDTO({...general_shipping})
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const getGeneralShipping = async (req, res, next) => {
    const generalShippingService = new GeneralShippingService();

    try{

        const general_shipping = await generalShippingService. getShippingService();

        return new ResponseLib(req, res).json({
            status: true,
            message: "General Shipping Updated Successfully",
            data: await GeneralShippingMapper.toDTO({...general_shipping})
        });
    }
    catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}