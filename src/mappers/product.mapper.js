import ProductService from "../services/product.service.js";
import OrderItemService from "../services/order_item.service.js";

export default class ProductMapper {
    static async toDTO(data) {
        const productService = new ProductService();
        const orderItemService = new OrderItemService();

        const variants = await productService.productVariants(data.id);
        const total_stock = await productService.productVariantTotalStock(data.id);

        const orderItems = await orderItemService.getOrderItems({ product_id: data.id });
        let totalSalePrice = 0;
        let latestOrderItem = null;
        if(orderItems.length > 0){
            const updatedOrderItems = orderItems.map(orderItem => {
                // Calculate the sale price by multiplying the amount with the quantity
                const salePrice = Number(orderItem.amount) * orderItem.quantity;
                return {
                    ...orderItem,
                    sale_price: salePrice
                };
            });

            totalSalePrice = updatedOrderItems.reduce((total, orderItem) => {
                return total + orderItem.sale_price;
            }, 0);

            const validOrderItems = orderItems.filter(item => item.created_at);

            if (validOrderItems.length > 0) {
                // Sort the valid orderItems array based on the created_at date in descending order
                validOrderItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                // Get the orderItem with the latest created_at date (first item in the sorted array)
                latestOrderItem = validOrderItems[0].created_at;
            }
        }

        return {
            product: {
                id: data.id,
                name: data.name,
                description: data.description,
                published: data.published,
                images: data.images,
                sku: data.sku,
                tags: data.tags,
                measuring_unit: data.measuring_unit,
                variants,
                total_stock,
                quantity_sold: orderItems.length,
                revenue: totalSalePrice,
                last_sold_at: latestOrderItem,
                created_at: data.created_at,
                updated_at: data.updated_at
            }
        };
    }

    static async dataDTO(data) {
        const productService = new ProductService();
        const total_stock = await productService.productTotalStock(data.id);
        return {
            product: {
                id: data.id,
                name: data.name,
                description: data.description,
                images: data.images,
                published: data.published,
                total_stock,
                created_at: data.created_at
            }
        };
    }

    static async userdataDTO(data) {
        const productService = new ProductService();
        const total_stock = await productService.productTotalStock(data.id);
        const variants = await productService.productVariants(data.id);
        const orderItemService = new OrderItemService();
        const orderItems = await orderItemService.getOrderItems({ product_id: data.id });
        return {
            product: {
                id: data.id,
                name: data.name,
                description: data.description,
                published: data.published,
                images: data.images,
                sku: data.sku,
                tags: data.tags,
                measuring_unit: data.measuring_unit,
                variants,
                total_stock,
                quantity_sold: orderItems.length,
                created_at: data.created_at,
                discount: null,
                reviews: null
            }
        };
    }
}
