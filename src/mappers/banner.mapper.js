import CategoryService from "../services/category.service.js";

export default class BannerMapper {
    static async toDTOCategoryBanner(data) {
        const categoryService = new CategoryService();
        const category = await categoryService.findCategory({id: data.category_id})
        return {
            desktop_image: data.desktop_image,
            tablet_image: data.tablet_image,
            mobile_image: data.mobile_image,
            category: category ? category.name : null
        }
    }
}
