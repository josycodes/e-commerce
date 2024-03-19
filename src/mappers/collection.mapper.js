import ProductCollectionService from "../services/product_collection.service.js";
export default class CollectionMapper {
    static async toDTO(data) {
        const productCollectionService = new ProductCollectionService();
        const [type_products] = await productCollectionService.findProductsCount({
            collection_id: data.id
        });

        const sumStock = await productCollectionService.findTotalStockCollectionProducts(data.id);
        return {
            collection: {
                id: data.id,
                name: data.name,
                slug: data.slug,
                description: data.description,
                type_products: parseInt(type_products.count,0),
                total_stock: sumStock
            }
        }
    }
}
