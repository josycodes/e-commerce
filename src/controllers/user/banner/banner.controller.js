import ResponseLib from "../../../libs/Response.lib.js";
import BannerService from "../../../services/banner.service.js";
import CategoryBannerService from "../../../services/category_banner.service.js";
import CountdownBannerService from "../../../services/countdown_banner.service.js";

export const banners = async (req, res, next) => {

    const bannerService = new BannerService();
    const categoryBannerService = new CategoryBannerService();
    const countdownBannerService = new CountdownBannerService();
    try {
        const banners = await bannerService.allBanners();
        const category_banners = await categoryBannerService.allBanners();
        const countdown_banners = await countdownBannerService.allBanners();
        return new ResponseLib(req, res).json({
            status: true,
            data: {
                main_banner: banners,
                category_banner: category_banners,
                countdown_banner: countdown_banners,
            }
        });
    } catch (error) {
        next(error)
    }
}
