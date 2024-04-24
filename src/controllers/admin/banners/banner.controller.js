import ErrorLib, { BadRequest, NotFound } from "../../../libs/Error.lib.js";
import ResponseLib from "../../../libs/Response.lib.js";
import {IncomingForm} from "formidable";
import CloudinaryIntegration from "../../../integrations/cloudinary.integration.js";
import BannerService from "../../../services/banner.service.js";
import CategoryBannerService from "../../../services/category_banner.service.js";
import CountdownBannerService from "../../../services/countdown_banner.service.js";
import moment from "moment/moment.js";

export const updateMainBanner = async (req, res, next) => {
    const bannerService = new BannerService();
    try {
        const form = new IncomingForm();
        await form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: "Error Parsing form"
                });
            }
            const { link } = fields;
            const { desktop_image, tablet_image, mobile_image } = files;

            if (!desktop_image || !tablet_image || !mobile_image) {
                return res.status(400).json({
                    status:false,
                    message: "Missing required fields: desktop_image, tablet_image and mobile_image"
                });
            }
            let desktop_url = null;
            let tablet_url = null;
            let mobile_url = null;

            //Desktop
            await CloudinaryIntegration.upload(desktop_image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    desktop_url = result.secure_url
                }
            });

            //Tablet
            await CloudinaryIntegration.upload(tablet_image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    tablet_url = result.secure_url
                }
            });

            //mobile
            await CloudinaryIntegration.upload(mobile_image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    mobile_url = result.secure_url
                }
            });

            const updatedBanner = await bannerService.updateBanner({
                banner_type: 'main'
            },{
                banner_type: 'main',
                desktop_image: desktop_url,
                tablet_image: tablet_url,
                mobile_image: mobile_url,
                link: link
            });

            return new ResponseLib(req, res).json({
                status: true,
                message: "Main Banner Updated",
                data: updatedBanner
            });
        });
    } catch (error) {
        next(error)
    }
}

export const updateSubBanner = async (req, res, next) => {
    const bannerService = new BannerService();
    try {
        const form = new IncomingForm();
        await form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: "Error Parsing form"
                });
            }

            const { banner_id, link } = fields;
            const { desktop_image, tablet_image, mobile_image } = files;

            const check = await bannerService.findBanner({id: banner_id[0]});
            if(check.banner_type !== 'sub'){
                return next(new BadRequest('Must be a Sub Banner'));
            }

            if (!desktop_image || !tablet_image || !mobile_image) {
                return res.status(400).json({
                    status:false,
                    message: "Missing required fields: desktop_image, tablet_image and mobile_image"
                });
            }

            let desktop_url = null;
            let tablet_url = null;
            let mobile_url = null;

            //Desktop
            await CloudinaryIntegration.upload(desktop_image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    desktop_url = result.secure_url
                }
            });

            //Tablet
            await CloudinaryIntegration.upload(tablet_image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    tablet_url = result.secure_url
                }
            });

            //mobile
            await CloudinaryIntegration.upload(mobile_image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    mobile_url = result.secure_url
                }
            });

            const updatedBanner = await bannerService.updateBanner({
                id: banner_id[0]
            },{
                banner_type: 'sub',
                desktop_image: desktop_url,
                tablet_image: tablet_url,
                mobile_image: mobile_url,
                link: link
            });

            return new ResponseLib(req, res).json({
                status: true,
                message: "Sub Banner Updated",
                data: updatedBanner
            });
        });
    } catch (error) {
        next(error)
    }
}

export const updateCategoryBanner = async (req, res, next) => {
    const categoryBannerService = new CategoryBannerService();
    try {
        const form = new IncomingForm();
        await form.parse(req, async function (err, fields, files) {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: "Error Parsing form"
                });
            }
            const { category_id, banner_id, link } = fields;
            const { desktop_image, tablet_image, mobile_image } = files;

            if (!category_id || !desktop_image || !tablet_image || !mobile_image || !banner_id) {
                return res.status(400).json({
                    status:false,
                    message: "Missing required fields: category_id, desktop_image, tablet_image, mobile_image and banner_id"
                });
            }
            const check = await categoryBannerService.findBanner({id: banner_id[0]});
            if(!check){
                return next(new BadRequest('Banner not found'));
            }

            let desktop_url = null;
            let tablet_url = null;
            let mobile_url = null;

            //Desktop
            await CloudinaryIntegration.upload(desktop_image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    desktop_url = result.secure_url
                }
            });

            //Tablet
            await CloudinaryIntegration.upload(tablet_image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    tablet_url = result.secure_url
                }
            });

            //mobile
            await CloudinaryIntegration.upload(mobile_image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    mobile_url = result.secure_url
                }
            });

            const updatedBanner = await categoryBannerService.updateBanner({
                id: banner_id[0]
            },{
                category_id: category_id[0],
                desktop_image: desktop_url,
                tablet_image: tablet_url,
                mobile_image: mobile_url,
                link: link,
                status: 'active'
            });

            return new ResponseLib(req, res).json({
                status: true,
                message: "Category Banner Updated",
                data: updatedBanner
            });
        });
    } catch (error) {
        next(error)
    }
}

export const updateCountdownBanner = async (req, res, next) => {
    const countdownBannerService = new CountdownBannerService();
    try {

        const { main_text, caption, start_date, end_date } = req.body;
        console.log(req.body);

        const updatedBanner = await countdownBannerService.updateBanner({
            main_text: main_text,
            caption: caption,
            start_date: start_date,
            end_date: end_date,
            status: 'active',
            updated_at: moment().format('MM-DD-YYYY')
        });

        return new ResponseLib(req, res).json({
            status: true,
            message: "Countdown Banner Updated",
            data: updatedBanner
        });

    } catch (error) {
        next(error)
    }
}

export const allBanners = async (req, res, next) => {
    const bannerService = new BannerService();
    const categoryBannerService = new CategoryBannerService();
    const countdownBannerService = new CountdownBannerService();
    try {
        const banners = await bannerService.allBanners();
        const category_banners = await categoryBannerService.allBanners();
        const countdown_banners = await countdownBannerService.getBanner();
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
