// import mongoose library
import mongoose from "mongoose";

// const is a variable and userSchema is a variable name, new is a create a new object 
// mongoose.Schema means schema is a class provided by mongoose like fields name, data types and etc.
// field name like name, email, password etc.
// type:string is a data type where string means value in a text not in the number
// required:true means if not insert the field name, mongodb will not save the documentt
// unique:true means no duplicate values are required
// resetToken means when the user can forgot password
// createdAt means database can store date and time when user can enter our details
// default: Date.now means database saves accurate date and time
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase:true, trim:true  },
    password: { type: String, required: true, maxlength:8 },
    role: { type : String, enum:["user","admin"], default:"user"},
    plan : {type : mongoose.Schema.Types.ObjectId, ref:"Plan", default:null},
    resetToken: String,
    CreatedAt: { type: Date, default: Date.now },
});

// const is a variable and AuthModel is a variable name, mongoose.model means create a model
// "User" is a model name
// userSchema is given to mongoose
const User = mongoose.model("User", userSchema);

// export means no other file can access AuthModel
// default means main thing the file exports
export default User;