import CategoryService from "../../../services/category.service.js";
import CategoryMapper from "../../../mappers/category.mapper.js";
import ResponseLib from "../../../libs/Response.lib.js";

export const getAll = async (req, res, next) => {
    const categoryService = new CategoryService();
    try {
        const categories = await categoryService.getAllCategories();
        const active_categories = await categoryService.getCountCategories({status: true});
        const inactive_categories = await categoryService.getCountCategories({status: false});
        const categoriesDTO = await Promise.all(categories.map(async (category) => {
            return CategoryMapper.toDTO({...category});
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Categories Loaded",
            data: categoriesDTO,
            all_categories: categories.length,
            active_categories: parseInt(active_categories[0].count) ,
            inactive_categories: parseInt(inactive_categories[0].count)
        });
    } catch (error) {
        next(error)
    }
}