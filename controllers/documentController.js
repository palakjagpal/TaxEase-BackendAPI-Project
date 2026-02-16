import User from "../models/User.js";
import dotenv from "dotenv";
import generateToken from "../utils/generateToken.js";
import cloudinary from "cloudinary";
import Document from "../models/Document.js";
import TaxProfile from "../models/TaxProfile.js";
import path from "path";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";
import { resolve } from "dns";

dotenv.config();

cloudinary.v2.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});


export const uploadDocument = async(req,res,next) => {
    try{
        if(!req.file){
            return res.status(400).json({message : "No file uploaded"});
        }

        const {taxProfile, type} = req.body;

        const fileExt = path.extname(req.file.originalname).replace(".","").toLowerCase();

        const uploadResult = await new Promise((resolve,reject) => {
            cloudinary.v2.uploader.upload_stream({
                resource_type : "auto",
                folder : "documents",
            },
            (error, result) => {
                if(error)
                    reject(error);
                resolve(result);
            }
            )
            .end(req.file.buffer);
        });

        const document = await Document.create({
            user : req.user._id,
            taxProfile : taxProfile || null,
            type : type || "other",
            originalName : req.file.originalname,
            url : uploadResult.secure_url,
            cloudinaryPublicId : uploadResult.public_id,
            fileType : fileExt,
            size : req.file.size,
        });
        //201 error
        res.status(201).json({
            message : "Document uploaded successfully",
            document,
        });
    }catch(error){
        console.error(error);
        res.status(500).json({
            message : "Document uploaded failed"
        })
    }
};