import ErrorLib, { BadRequest, NotFound } from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import CategoryService from "../../../services/category.service.js";
import CategoryMapper from "../../../mappers/category.mapper.js";

/**
 * Todo: Category_id can be null
 * @param req
 * @param res
 * @param next
 * @returns {Promise<ResponseLib|*>}
 */
export const create = async (req, res, next) => {
    const categoryService = new CategoryService();
    try {
        const { name, description } = req.body;

        const createdCategory = await categoryService.createCategory({
            name, description
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "Variant Created",
            data: CategoryMapper.toDTO(createdCategory)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest) {
            return next(new BadRequest('Wrong credentials'))
        }
        next(error)
    }
}
