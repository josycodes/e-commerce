import ResponseLib from "../../libs/Response.lib.js";
import BannerService from "../../services/banner.service.js";
import CategoryBannerService from "../../services/category_banner.service.js";
import CountdownBannerService from "../../services/countdown_banner.service.js";
import BannerMapper from "../../mappers/banner.mapper.js";

export const banners = async (req, res, next) => {

    const bannerService = new BannerService();
    const categoryBannerService = new CategoryBannerService();
    try {
        const banners = await bannerService.allBanners();
        const category_banners = await categoryBannerService.allBanners();
         const category_bannerDTO = await Promise.all(category_banners.map(async (category_banner) => {
             return await BannerMapper.toDTOCategoryBanner({...category_banner});
         }));

        return new ResponseLib(req, res).json({
            status: true,
            data: {
                main_banner: banners,
                category_banner: category_bannerDTO
            }
        });
    } catch (error) {
        next(error)
    }
}

export const countdownBanner = async (req, res, next) => {

    const countdownBannerService = new CountdownBannerService();
    try {
        const countdown_banner = await countdownBannerService.getBanner();
        return new ResponseLib(req, res).json({
            status: true,
            data: {
                countdown_banner: countdown_banner,
            }
        });
    } catch (error) {
        next(error)
    }
}
