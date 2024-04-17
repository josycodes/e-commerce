import ProductService from "../../../services/product.service.js";
import ErrorLib, {NotFound} from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import RecentlyViewService from "../../../services/recently_view.service.js";
import RecentlyViewMapper from "../../../mappers/recently_view.mapper.js";
import moment from "moment";

export const addToRecentlyView = async (req, res, next) => {
    const productService = new ProductService();
    const recentlyViewService = new RecentlyViewService();
    try{
        const user = req.user;
        const { product_id } = req.body;

        //find Product
        const product = await productService.findProduct({id: product_id});
        if(!product) throw new NotFound('Product not found');

        const check = await recentlyViewService.findOneRecentlyView({user_id: user.id, product_id});
        if(!check){
            //Recently view for Users
            const added_data = await recentlyViewService.findAllRecentlyViewItems({user_id: user.id});
            if(added_data && added_data.length === 20){
                //remove the oldest recently added
                await recentlyViewService.removeOldestRecentlyView();
            }

            //Add to Recently_view
            await recentlyViewService.addToRecentlyView({
                product_id,
                user_id: user.id
            });
        }else {
            await recentlyViewService.updateRecentlyView({
                user_id: user.id,
                product_id
            }, {updated_at: moment().format('YYYY-MM-DD HH:mm:ss')});
        }

        return new ResponseLib(req, res).json({
            status: true,
            message: "Added"
        });
    }
    catch (error) {
        next(error)
    }
}

export const listRecentlyView = async (req, res, next) => {
    const recentlyViewService = new RecentlyViewService();
    try{
        const user = req.user;

        const items = await recentlyViewService.findAllRecentlyViewItems({
            user_id: user.id
        });
        const itemsDTO = await Promise.all(items.map(async (item) => {
            return await RecentlyViewMapper.dataDTO({...item})
        }));

        return new ResponseLib(req, res).json({
            status: true,
            message: "Loaded",
            data: itemsDTO
        });
    }
    catch (error) {
        next(error)
    }
}