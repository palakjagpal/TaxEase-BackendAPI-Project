import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId, ref : "User", required : true, index : true
        },
        taxProfile : {
            type : mongoose.Schema.Types.ObjectId, ref : "TaxProfile", default : null
        },
        type:{
            type: String, default : "other" //aadhar card, forms
        },
        originalName : {
            type : String, required : true
        },
        url : {
            type : String, required : true
        },
        cloudinaryPublicId : {
            type : String, required : true
        },
        fileType:{
            type : String,
            enum : ["png", "jpg", "jpeg", "pdf"],
            required : true,
            lowercase : true  //to avoid PNG or JPG, only allows png/jpg
        },
        size : {
            type : Number
        },
    },
    {
        timestamps : true
    }
)

const Documents = mongoose.model("Documents", documentSchema);
export default Documents;