import PromotionService from "../../../services/promotion.service.js";
import ResponseLib from "../../../libs/Response.lib.js";
import PromotionMapper from "../../../mappers/promotion.mapper.js";
import ErrorLib, {NotFound, BadRequest} from "../../../libs/Error.lib.js";

export const createPromotion = async (req, res, next) => {
    const promotionService = new PromotionService();
    try{
        const {
            code,
            discount_type,
            amount,
            minimum_spend,
            maximum_spend,
            free_shipping,
            description,
            commence_date,
            expiry_date,
            status
        } = req.body;

        //create Promotion
        const promotion = await promotionService.createPromotion({
            code,
            discount_type,
            amount,
            minimum_spend,
            maximum_spend,
            free_shipping,
            description,
            commence_date,
            expiry_date,
            status
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "Promotion created Successfully",
            data: PromotionMapper.toDTO(promotion)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const getPromotion = async (req, res, next) => {
    const promotionService = new PromotionService();
    try{
        const { promotion_id } = req.params;

        //get Promotion
        const promotion = await promotionService.getPromotion({id: promotion_id})

        return new ResponseLib(req, res).json({
            status: true,
            message: "Promotion created Successfully",
            data: PromotionMapper.toDTO(promotion)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}

export const updatePromotion = async (req, res, next) => {
    const promotionService = new PromotionService();
    try{
        const { promotion_id } = req.params;
        const {
            code,
            discount_type,
            amount,
            minimum_spend,
            maximum_spend,
            free_shipping,
            description,
            commence_date,
            expiry_date,
            status
        } = req.body;

        //get Promotion
        const promotion = await promotionService.getPromotion({id: promotion_id});

        const updatedPromotion = await promotionService.updatePromotion({
            code,
            discount_type,
            amount,
            minimum_spend,
            maximum_spend,
            free_shipping,
            description,
            commence_date,
            expiry_date,
            status
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "Promotion updated Successfully",
            data: PromotionMapper.toDTO(updatedPromotion)
        });
    } catch (error) {
        if (error instanceof NotFound || error instanceof BadRequest || error instanceof ErrorLib) {
            return next(error);
        }
        next(error)
    }
}