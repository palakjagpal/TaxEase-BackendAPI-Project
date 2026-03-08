import User from "../models/User.js";
import dotenv from "dotenv";
import generateToken from "../utils/generateToken.js";
import cloudinary from "cloudinary";
import Document from "../models/Document.js";
import TaxProfile from "../models/TaxProfile.js";
import path from "path";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.js";

dotenv.config();

cloudinary.v2.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

/**Upload documents 
 * post method - /api/documents
 * **/


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
            user : req.user.id,
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

/**
 * GEt documents 
 * get method - /api/documents
 * 
 */

export const getDocuments = async(req,res) => {
    try{
        const documents = await Document.find({user : req.user.id}).populate("taxProfile").sort({createdAt : -1});

        res.json(documents);
    }catch(error){
        res.status(500).json({
            message : "Failed to fetch documents"});
    }
};

/**
 * Update documents
 * put method - /api/documents/:id
 * 
 */

export const updateDocuments = async(req,res) => {
    try{
        const {type, taxProfile} = req.body;
        
        const document = await Document.findOne({
            _id : req.params.id,
            user : req.user.id,
        });
        if(!document) {
            return res.status(404).json({
                message : "Document not found"
            });
        }
        if(type) document.type = type;
        if(taxProfile !== undefined) document.taxProfile = taxProfile;

        await document.save();

        res.json({
            message : "Document updated successfully",
            document,
        });
    }catch(error){
        res.status(500).json({
            message : "Document update failed"
        });
    }
}

/**
 * Delete document
 * delete method - /api/documents/:id
 */
export const deleteDocument = async(req,res) =>{
    try{
        const document = await Document.findOne({
            _id : req.params.id,
            user : req.user.id,
        });

        if(!document){
            return res.status(404).json({
                message : "Document not found"
            })
        }

        await cloudinary.v2.uploader.destroy(document.cloudinaryPublicId);
        await document.deleteOne();
        res.json({
            message : "Document deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            message : "Document deletion failed"
        })
    }
};
