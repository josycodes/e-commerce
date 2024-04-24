import CategoryService from "../../../services/category.service.js";
import CategoryMapper from "../../../mappers/category.mapper.js";
import ResponseLib from "../../../libs/Response.lib.js";
import ErrorLib from "../../../libs/Error.lib.js";

export const getAll = async (req, res, next) => {
    const categoryService = new CategoryService();
    try {
        const categories = await categoryService.getAllCategories({
            status: true
        });
        const categoriesDTO = await Promise.all(categories.map(async (category) => {
            return CategoryMapper.toDTOWithoutProduct({...category});
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

export const getAllCategoriesForFilter = async (req, res, next) => {
    const categoryService = new CategoryService();
    try {
        const categories = await categoryService.getAllCategories({
            status: true
        });
        const categoriesDTO = await Promise.all(categories.map(async (category) => {
            return CategoryMapper.toDTOWithProductCount({...category});
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

export const getCategory = async (req, res, next) => {
    const categoryService = new CategoryService();
    try {
        const { category_id } = req.params;

        //Validate category_id
        const category = await categoryService.findCategory({
            id: category_id
        });
        if(!category){
            throw new ErrorLib('Invalid category', 400);
        }

        return new ResponseLib(req, res).json({
            status: true,
            message: "Category Loaded",
            data: await CategoryMapper.toDTO({...category}),
        });
    } catch (error) {
        next(error)
    }
}


export const getCategoryBySlug = async (req, res, next) => {
    const categoryService = new CategoryService();
    try {
        const { category_slug } = req.params;

        //Validate category_id
        const category = await categoryService.findCategory({
            slug: category_slug
        });
        if(!category){
            throw new ErrorLib('Invalid category', 400);
        }

        return new ResponseLib(req, res).json({
            status: true,
            message: "Category Loaded",
            data: await CategoryMapper.toDTO({...category}),
        });
    } catch (error) {
        next(error)
    }
}
