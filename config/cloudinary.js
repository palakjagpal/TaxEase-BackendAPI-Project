import cloudinary from "cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : CLOUDINARY_API_SECRET
});