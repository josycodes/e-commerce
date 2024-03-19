import LoggerLib from "../libs/Logger.lib.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from 'dotenv';
import ErrorLib from "../libs/Error.lib.js";
config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export default new class CloudinaryIntegration{
    constructor() {}

    async upload(path, options){
        try{
            const result = await cloudinary.uploader.upload(path, options);
            return result.secure_url;
        }
        catch (error) {
           throw new Error(error.message);
        }
    }
}