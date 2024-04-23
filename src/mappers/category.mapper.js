import ProductService from "../services/product.service.js";
import ProductCategoriesService from "../services/product_categories.service.js";
import ProductMapper from "./product.mapper.js";
export default class CategoryMapper {
    static async toDTO(data) {
        const productService = new ProductService();
        const productCategoryService = new ProductCategoriesService();
        const product_categories = await productCategoryService.findProductCategory({
            category_id: data.id
        });

        if(product_categories.length > 0){
            const productsDTO = await Promise.all(product_categories.map(async (product_category) => {
                const product = await productService.findProduct({id: product_category.product_id});
                return await ProductMapper.toDTO1({...product});
            }));

            // Count published products
            const publishedCount = productsDTO.filter(item => item.published).length;
            // Count unpublished products
            const unpublishedCount = productsDTO.filter(item => !item.published).length;

            return {
                id: data.id,
                name: data.name,
                slug: data.slug,
                description: data.description,
                status: data.status,
                image: data.image,
                products: productsDTO,
                total_products_count: product_categories.length,
                published_products_count: publishedCount,
                inactive_products_count: unpublishedCount,
                created_at: data.created_at
            }
        }else{
            return {
                id: data.id,
                name: data.name,
                slug: data.slug,
                description: data.description,
                status: data.status,
                image: data.image,
                products: null,
                created_at: data.created_at
            }
        }

    }

    static toDTOWithoutProduct(data) {
        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            status: data.status,
            image: data.image,
            created_at: data.created_at
        }
    }

    static async toDTOWithProductCount(data) {
        const productCategoryService = new ProductCategoriesService();
        const product_categories = await productCategoryService.findProductsCount({
            category_id: data.id
        });
        return {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            status: data.status,
            image: data.image,
            created_at: data.created_at,
            product_count: product_categories[0].count
        }
    }
}
