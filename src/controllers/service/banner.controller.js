import ResponseLib from "../../libs/Response.lib.js";
import CountryService from "../../services/country.service.js";
import CountryMapper from "../../mappers/country.mapper.js";

export const banners = async (req, res, next) => {
    const countryService = new CountryService();
    try {
        const countries = await countryService.getAllCountries();
        const productsDTO = await Promise.all(countries.map(async (country) => {
            return CountryMapper.toDTO({...country})
        }));
        return new ResponseLib(req, res).json({
            status: true,
            message: "Banner Data Load Successful",
            data: productsDTO
        });
    } catch (error) {
        next(error)
    }
}
