import mongoose from "mongoose";

// defining Plan schema
// this schema represents a subscription or pricing plan offered by the system
// for example: Free plan, Basic plan, Premium plan, etc.
const planSchema = new mongoose.Schema(
    {
        // name of the plan
        // type is String, required because every plan must have a name
        // trim removes extra spaces from the beginning and end of the string
        // example: " Premium Plan " → "Premium Plan"
        name : { type : String, required : true,trim : true},

        // description of the plan
        // optional field, default value is an empty string
        // used to explain what the plan includes or who it is for
        // example: "This plan includes unlimited access to all features"
        description : { type : String, default : "" },

        // price of the plan
        // type is Number, required because a plan must have a price
        // min: 0 ensures the price cannot be negative
        // example: 0 (free plan), 499, 999, etc.
        price : { type : Number, required : true, min : 0},

        // currency in which the price is defined
        // default is "INR" (Indian Rupees)
        // useful if the application supports multiple currencies in future
        currency : { type : String, default : "INR"},

        // features included in the plan
        // stored as an array of strings
        // each string represents one feature of the plan
        // example: ["Unlimited projects", "Priority support", "Custom reports"]
        features : [{ type : String }],

        // isActive indicates whether the plan is currently available for users
        // default true means the plan is active and visible
        // can be set to false to disable a plan without deleting it
        isActive : { type : Boolean, default : true}
    },
    {
        // enabling timestamps option
        // automatically adds:
        // createdAt → when the plan was created
        // updatedAt → when the plan was last updated
        // useful for auditing and tracking changes
        timestamps : true
    }
);

// creating the Plan model using the schema
// "Plan" is the model name
// MongoDB will create a collection named "plans" (lowercase + plural)
const Plan = mongoose.model("Plan", planSchema);
export default Plan;
