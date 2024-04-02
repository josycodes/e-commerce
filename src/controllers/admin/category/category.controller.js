import ErrorLib, { BadRequest, NotFound } from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import CategoryService from "../../../services/category.service.js";
import CategoryMapper from "../../../mappers/category.mapper.js";

export const create = async (req, res, next) => {
    const categoryService = new CategoryService();
    try {
        const { name, slug, description, status } = req.body;

        const createdCategory = await categoryService.createCategory({
            name, slug, description, status
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "Category Created",
            data: await CategoryMapper.toDTO(createdCategory)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest) {
            return next(new BadRequest('Wrong credentials'))
        }
        next(error)
    }
}

export const getAll = async (req, res, next) => {
    const categoryService = new CategoryService();
    try {
        const categories = await categoryService.getAllCategories();
        const categoriesDTO = await Promise.all(categories.map(async (category) => {
            return CategoryMapper.toDTO({...category});
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Categories Loaded",
            data: categoriesDTO
        });
    } catch (error) {
        next(error)
    }
}

export const edit = async (req, res, next) => {
    const categoryService = new CategoryService();
    try {
        const { category_id } = req.params.category_id;
        const { name, slug, description } = req.body;

        //Validate category_id
        const category = await categoryService.findCategory({id: category_id});
        if(!category){
            throw new ErrorLib('Invalid category', 400);
        }

        const updated_category = await categoryService.updateCategory({ id: category.id }, { name, slug, description })

        return new ResponseLib(req, res).json({
            status: true,
            message: "Category Updated",
            data: CategoryMapper.toDTO(updated_category)
        });
    } catch (error) {
        next(error)
    }
}

/**
 * Todo: Figure out where products under removed collections would go to
 * @param req
 * @param res
 * @param next
 * @returns {Promise<ResponseLib|*>}
 */
export const remove = async (req, res, next) => {
    const categoryService = new CategoryService();
    try {
        const { category_id } = req.params.category_id;

        //Validate category_id
        const category = await categoryService.findCategory({id: category_id});
        if(!category){
            throw new ErrorLib('Invalid Category', 400);
        }

        //Remove Category
        await categoryService.deleteCategory({id: category.id});

        return new ResponseLib(req, res).json({
            status: true,
            message: "Collection Successful"
        });
    } catch (error) {
        next(error)
    }
}
