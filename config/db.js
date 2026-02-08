import mongoose from "mongoose";

// defining an asynchronous function to connect the application to MongoDB
// async is used because mongoose.connect() returns a promise
const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);  
        console.log("MongoDB connected successfully !!");
    }catch(error){
        console.log("Error in connecting to MongoDB", error);
        // exiting the Node.js process with a non-zero code (1)
        // this indicates that the application failed to start due to a critical error
        // prevents the app from running without a database connection
        process.exit(1);
    }
}

export default connectDb;