import ProductService from "../services/product.service.js";
import ProductCategoriesService from "../services/product_categories.service.js";
import ProductMapper from "./product.mapper.js";
export default class CategoryMapper {
    static async toDTO(data) {
        const productCategoryService = new ProductCategoriesService();
        const products = await productCategoryService.findProductCategory({
            category_id: data.id
        });
        if(products.count === 0){
            const productsDTO = await Promise.all(products.map(async (product) => {
                return ProductMapper.toDTO({...product});
            }));
        }
        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            status: data.status,
            products: (products.count === 0) ? productsDTO : null
        }
    }
}
