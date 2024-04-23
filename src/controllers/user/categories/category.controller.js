import CategoryService from "../../../services/category.service.js";
import CategoryMapper from "../../../mappers/category.mapper.js";
import ResponseLib from "../../../libs/Response.lib.js";

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