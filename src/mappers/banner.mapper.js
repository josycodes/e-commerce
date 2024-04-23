import CategoryService from "../services/category.service.js";

export default class BannerMapper {
    static async toDTOCategoryBanner(data) {
        const categoryService = new CategoryService();
        const category = await categoryService.findCategory({id: data.category_id})
        return {
            pricing: data.pricing,
            image: data.image,
            category: category.name
        }
    }
}
