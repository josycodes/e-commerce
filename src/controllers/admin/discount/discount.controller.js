import DiscountService from "../../../services/discount.service.js";
import ResponseLib from "../../../libs/Response.lib.js";
import DiscountMapper from "../../../mappers/discount.mapper.js";
import ErrorLib, {NotFound, BadRequest} from "../../../libs/Error.lib.js";
import ProductService from "../../../services/product.service.js";
import ProductDiscountService from "../../../services/product_discount.service.js";
import ProductMapper from "../../../mappers/product.mapper.js";

export const createDiscount = async (req, res, next) => {
    const discountService = new DiscountService();
    try{
        const {
            title,
            code,
            discount_type,
            value,
            minimum_order_amount,
            maximum_customer_use,
            maximum_claims,
            description,
            start_date,
            end_date,
            status
        } = req.body;

        //create Discount
        const discount = await discountService.createDiscount({
            title,
            code,
            discount_type,
            value,
            minimum_order_amount,
            maximum_customer_use,
            maximum_claims,
            description,
            start_date,
            end_date,
            status
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "Discount created Successfully",
            data: DiscountMapper.toDTO({...discount})
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const getDiscount = async (req, res, next) => {
    const discountService = new DiscountService();
    try{
        const { discount_id } = req.params;

        //get Discount
        const discount = await discountService.getDiscount({id: discount_id});

        //Get Discounted Products
        const discountedProducts = await discountService.getDiscountedProducts({id: discount.id})

        return new ResponseLib(req, res).json({
            status: true,
            message: "Discount loaded Successfully",
            data: DiscountMapper.toDTO(discount, discountedProducts)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const getDiscountedProduct = async (req, res, next) => {
    const discountService = new DiscountService();
    const productService = new ProductService();
    try{
        const { discount_id, product_id } = req.params;

        //get Discount
        const discount = await discountService.getDiscount({id: discount_id});
        if(!discount) throw new NotFound('Discount not Found');

        //get Product
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not Found');
        const productDTO = await ProductMapper.toDTO({...product});

        //Get Discounted Product
        const discountedProduct = await discountService.getDiscountedProduct(discount, product)

        return new ResponseLib(req, res).json({
            status: true,
            message: "Discount Product loaded Successfully",
            data: {
                product: productDTO,
                discount: DiscountMapper.toDTO(discount, discountedProduct)
            }
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const updateDiscount = async (req, res, next) => {
    const discountService = new DiscountService();
    try{
        const { discount_id } = req.params;
        const {
            title,
            code,
            discount_type,
            value,
            minimum_order_amount,
            maximum_customer_use,
            maximum_claims,
            description,
            start_date,
            end_date,
            status
        } = req.body;

        //get Discount
        const discount = await discountService.getDiscount({id: discount_id});
        if(!discount) throw new ErrorLib('Discount not found')

        const data = {
            title,
            code,
            discount_type,
            value,
            minimum_order_amount,
            maximum_customer_use,
            maximum_claims,
            description,
            start_date,
            end_date,
            status
        };

        // Remove undefined values from the updatedData object
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

        // Update the discount with the available data
        const updatedDiscount = await discountService.updateDiscount({ id: discount.id }, data);

        return new ResponseLib(req, res).json({
            status: true,
            message: "Discount updated Successfully",
            data: DiscountMapper.toDTO(updatedDiscount)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const addProducts = async (req, res, next) => {
    const discountService = new DiscountService();
    const productService = new ProductService();
    const product_discountService = new ProductDiscountService()
    try{
        const { discount_id } = req.params;
        const { product_id } = req.body;

        //get Discount
        const discount = await discountService.getDiscount({id: discount_id});
        if(!discount) throw new ErrorLib('Discount not found')

        for (const id of product_id) {
            const product = await productService.findProduct({id});
            if(product){
                await product_discountService.createProductDiscounts({
                    discount_id: discount.id,
                    product_id: product.id
                })
            }
        }

        return new ResponseLib(req, res).json({
            status: true,
            message: "Discount added to Products Successfully"
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}