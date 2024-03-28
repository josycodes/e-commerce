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
            shipping_sales_location_option,
            customer_location,
            promotional_codes,
            taxes,
            store_address,
            store_address_postal_code,
            sales_location
        } = req.body;

        //create Shipping Service
        const general_shipping = await generalShippingService.updateShippingService({
            shipping_sales_location_option: shipping_sales_location_option,
            customer_location,
            taxes,
            promotional_codes,
            store_address,
            store_address_postal_code
        });

        // Create Sales Location
        await Promise.all(sales_location.map(async (sale_location) => {
            await salesLocationService.createSalesLocation({
                country: sale_location.country,
                postal_code: sale_location.postal_code
            })
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "General Shipping Updated Successfully",
            data: GeneralShippingMapper.toDTO({general_shipping})
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}