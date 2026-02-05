//importing mongoose
const mongoose = require("mongoose");

//defining TaxProfile schema
const TaxProfileSchema = new mongoose.Schema({
    //user type is ObjectId referencing User model, index for faster queries as one user can have multiple tax profiles for different years so we will index on user and assessmentYear for example: a unique compound index on (user, assessmentYear) for faster lookups
    //reference syntax : {type : mongoose.Schema.Types.ObjectId, ref : "ReferencedModelName"}
    user : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true, index : true},
    //assessmentYear is a string representing the financial year for which the tax profile is created like "2023-2024"
    assessmentYear : {type : String, required : true}, 
    //pan is a string representing the Permanent Account Number, required, uppercase and trimmed because PANs are case insensitive and should not have leading/trailing spaces
    pan : {type : String, required : true, uppercase : true, trim : true},
    //fullname is a string representing the full name of the taxpayer, required
    fullname : {type : String, required : true},
    //dob is a date representing the date of birth of the taxpayer, required
    dob : { type : Date, required : true},
    //address is an embedded document containing line1, line2, city, state, pincode all as strings, line 1 represents the primary address line, line 2 is optional secondary address line
    address :  {
        line1 : String,
        line2 : String,
        city : String,
        state : String,
        pincode : String
    },
    //income is an embedded document containing salary, business, capitalGains, other all as numbers with default value 0
    income : {
        salary : { type : Number , default : 0},
        business : {type : Number, default : 0},
        capitalGains : {type : Number, default : 0},
        other : {type : Number, default : 0}
    },

    //deductions is an embedded document containing section80C, section80D, other all as numbers with default value 0
    //section80C represents deductions under section 80C of the Income Tax Act, section80D represents deductions under section 80D of the Income Tax Act other represents any other deductions
    //it will store the total amount of deductions claimed under each category like investments in PF, life insurance premiums, health insurance premiums etc.
    deductions : {
        section80C : {type : Number, default : 0},
        section80D : {type : Number, default : 0},
        other : {type : Number, default : 0}
    },

    //status field to track the current status of the tax profile, can be "draft", "submitted", "processing", "completed"
    //it will help in managing the workflow of tax filing and stores the current state of the tax profile wether user is still editing it (draft), has submitted it for processing (submitted), is being processed by the system (processing), or has been completed (completed)
    status : { 
        type : String, enum : ["draft", "submitted", "processing", "completed"], default : "draft"
    },

    //submittedAt field to store the date and time when the tax profile was submitted, default is null
    submittedAt : { 
        type : Date, default : null
    }
},
{
    //enabling timestamps to automatically manage createdAt and updatedAt fields
    //it will help in tracking when the tax profile was created and last updated
    timestamps : true
}

);

//creating a unique compound index on user and assessmentYear to ensure one tax profile per user per year
//this will prevent duplicate tax profiles for the same user in the same assessment year
//for example, a user cannot have two tax profiles for the year 2023-2024
//It will store the index in the database for faster lookups and enforce uniqueness at the database level
//syntax : Schema.index({field1 : 1, field2 : 1}, {unique : true});
//here 1 indicates ascending order for the index for both fields i.e. user and assessmentYear
//unique : true enforces uniqueness constraint
TaxProfileSchema.index({user : 1, assessmentYear : 1}, {unique : true});

//exporting TaxProfile model to be used in other parts of the application
//the model name is "TaxProfile" and it uses the TaxProfileSchema defined above
//this will allow us to perform CRUD operations on tax profiles in the MongoDB database
//for example, we can create, read, update, and delete tax profiles using this model
module.exports = mongoose.model("TaxProfile", TaxProfileSchema);
