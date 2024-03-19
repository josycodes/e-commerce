import ErrorLib, { BadRequest, NotFound } from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import VariantService from "../../../services/variant.service.js";
import CategoryService from "../../../services/category.service.js";
import VariantMapper from "../../../mappers/variant.mapper.js";

/**
 * Todo: Category_id can be null
 * @param req
 * @param res
 * @param next
 * @returns {Promise<ResponseLib|*>}
 */
export const create = async (req, res, next) => {
    const variantService = new VariantService();
    try {
        const { type, value, category_id } = req.body;
        //check if variant exist
        const check = await variantService.findVariant({type, value});
        if (check) throw new ErrorLib('Variant already exists');

        const createdVariant = await variantService.createVariant({
            type, value
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "Variant Created",
            data: VariantMapper.toDTO({...createdVariant})
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest) {
            return next(new BadRequest('Wrong credentials'))
        }
        next(error)
    }
}

export const all = async(req, res, next) => {
    const variantService = new VariantService();
    const categoryService = new CategoryService();
    try{
        const { category_id } = req.params;
        //validate Category
        const category = categoryService.findCategory({id: category_id});
        if(!category) throw new ErrorLib('Invalid Category', 400);

        const variants = variantService.allVariants({category_id: category.id});
        const variantsDTO = await Promise.all(variants.map(async (variant) => {
            return VariantMapper.toDTO(variant);
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Loaded Varaints Successful",
            data: variantsDTO
        });
    }
    catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest) {
            return next(new BadRequest('Wrong credentials'))
        }
        next(error)
    }
}