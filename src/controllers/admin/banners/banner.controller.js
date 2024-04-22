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
            const { main_text, caption, charge, button_label } = fields;
            const { image } = files;

            if (!main_text || !button_label || !image) {
                return res.status(400).json({
                    status:false,
                    message: "Missing required fields: main_text, button_label and Image"
                });
            }
            let url = null;

            await CloudinaryIntegration.upload(image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    url = result.secure_url
                }
            });

            const updatedBanner = await bannerService.updateBanner({
                banner_type: 'main'
            },{
                banner_type: 'main',
                main_text: main_text[0],
                caption: caption[0],
                image: url,
                charge: charge[0],
                button_label: button_label[0]
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
            const { main_text, caption, banner_id } = fields;
            const { image } = files;

            if (!main_text || !image) {
                return res.status(400).json({
                    status:false,
                    message: "Missing required fields: main_text, Image"
                });
            }
            const check = await bannerService.findBanner({id: banner_id[0]});
            if(check.banner_type !== 'sub'){
                return next(new BadRequest('Must be a Sub Banner'));
            }

            let url = null;

            await CloudinaryIntegration.upload(image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    url = result.secure_url
                }
            });


            const updatedBanner = await bannerService.updateBanner({
                id: banner_id[0]
            },{
                banner_type: 'sub',
                main_text: main_text[0],
                caption: caption[0],
                image: url
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
            const { category_id, charge, banner_id } = fields;
            const { image } = files;

            if (!category_id || !charge || !image || !banner_id) {
                return res.status(400).json({
                    status:false,
                    message: "Missing required fields: Category_id, Image,Banner_id and Charge"
                });
            }
            const check = await categoryBannerService.findBanner({id: banner_id[0]});
            if(!check){
                return next(new BadRequest('Banner not found'));
            }

            let url = null;

            await CloudinaryIntegration.upload(image[0].filepath, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    url = result.secure_url
                }
            });

            const updatedBanner = await categoryBannerService.updateBanner({
                id: banner_id[0]
            },{
                category_id: category_id[0],
                pricing: charge[0],
                image: url
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
