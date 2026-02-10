//importing mongoose
import mongoose from "mongoose";
//defining TaxProfile schema
const TaxProfileSchema = new mongoose.Schema({
    
    //user type is ObjectId referencing User model, index for faster queries as one user can have multiple tax profiles for different years so we will index on user and assessmentYear for example: a unique compound index on (user, assessmentYear) for faster lookups
    //reference syntax : {type : mongoose.Schema.Types.ObjectId, ref : "ReferencedModelName"}
    //ObjectId stores MongoDB’s unique ID, eg - "user": "64f8c12a9e5c2a..."
    user : {type : mongoose.Schema.Types.ObjectId, ref : "User", required : true, index : true},
    
    //assessmentYear is a string representing the financial year for which the tax profile is created like "2023-2024", Tax data is year-specific
    assessmentYear : {type : String, required : true}, 
    
    //pan is a string representing the Permanent Account Number, required, uppercase and trimmed because PANs are case insensitive and should not have leading/trailing spaces
    pan : {type : String, required : true, uppercase : true, trim : true},
    
    //fullname is a string representing the full name of the taxpayer, required
    fullname : {type : String, required : true},
    
    //dob is a date representing the date of birth of the taxpayer, required
    dob : { type : Date, required : true},
    
    //Embedded documents store related data in a single document structure. A document can contain arrays and sub-documents with related data
    //syntax -> field : { field1:value1, field2:value2}
    //address is an embedded document containing line1, line2, city, state, pincode all as strings, line 1 represents the primary address line, line 2 is optional secondary address line
    address :  {
        line1 : String,
        line2 : String,
        city : String,
        state : String,
        pincode : String
    },
    
    //income is an embedded document containing salary, business, capitalGains, other all as numbers with default value 0
    //business represents income from business or profession, capitalGains represents income from sale of assets like property, stocks etc. other represents any other sources of income like rental income, interest income etc.
    //salary represents income from salary or wages, it will store the total amount of salary income for the assessment year, for example if a person has a monthly salary of 50000 then the salary field will store 600000 (50000 * 12) as the total salary income for the year. This will help in calculating the total taxable income and tax liability for the taxpayer.
    income : {
        salary : { type : Number , default : 0},
        business : {type : Number, default : 0},
        capitalGains : {type : Number, default : 0},
        other : {type : Number, default : 0}
    },

    //deductions is an embedded document containing section80C, section80D, other all as numbers with default value 0
    //section80C represents deductions under section 80C of the Income Tax Act, section80D represents deductions under section 80D of the Income Tax Act other represents any other deductions
    //Section 80C allows deductions for investments in specified financial instruments like PF, life insurance premiums, ELSS etc. 
    // Section 80D allows deductions for health insurance premiums paid for self, family and parents. Other deductions can include things like donations to charitable institutions, interest on home loan etc.
    //it will store the total amount of deductions claimed under each category like investments in PF, life insurance premiums, health insurance premiums etc.
    //for example, if a person has invested 150000 in PF and paid 20000 as life insurance premium then the section80C field will store 170000 (150000 + 20000) as the total deductions under section 80C. This will help in calculating the total taxable income and tax liability for the taxpayer.
    //It will be used to calculate the total deductions claimed by the taxpayer and reduce it from the total income to arrive at the taxable income for the assessment year. This will help in determining the tax liability of the taxpayer based on the applicable tax slabs and rates.
    deductions : {
        section80C : {type : Number, default : 0},
        section80D : {type : Number, default : 0},
        other : {type : Number, default : 0}
    },

    //status field to track the current status of the tax profile, can be "draft", "submitted", "processing", "completed"
    //it will help in managing the workflow of tax filing and stores the current state of the tax profile wether user is still editing it (draft), has submitted it for processing (submitted), is being processed by the system (processing), or has been completed (completed)
    //for example, when a user creates a new tax profile and starts filling in the details, the status will be "draft". Once the user submits the tax profile for processing, the status will change to "submitted". When the system starts processing the tax profile, the status will change to "processing". Finally, once the tax profile has been processed and finalized, the status will change to "completed". This will help in tracking the progress of each tax profile and managing the workflow effectively.
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
const TaxProfile = mongoose.model("TaxProfile", TaxProfileSchema);
export default TaxProfile;