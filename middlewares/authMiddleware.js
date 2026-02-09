import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
// Load environment variables from .env file
// This allows us to access variables like JWT_SECRET and JWT_EXPIRES_IN in our code
dotenv.config();

// Middleware function to authenticate requests using JWT tokens
//req is the request object, res is the response object, and next is a function to pass control to the next middleware
//res is used to send a response back to the client if authentication fails
//next is called to pass control to the next middleware function if authentication is successful
export const authMiddleware = (req, res, next) => {
    // Extract the Authorization header from the incoming request
    // The expected format of the header is "Bearer <token>"
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is present and starts with "Bearer "
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        // If the header is missing or does not start with "Bearer ", return a 401 Unauthorized response
        return res.status(401).json({message : "Access Denied: No token provided"});
    }

    // Extract the token from the Authorization header by splitting the string and taking the second part
    //split(" ") splits the string into an array based on spaces, and [1] accesses the second element of the array, which is the token itself
    const token = authHeader.split(" ")[1];

    try{
        // Verify the token using the JWT secret key defined in environment variables        // If the token is valid, decoded will contain the payload of the token (e.g., user ID)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded token payload to the request object for use in subsequent middleware or route handlers
        // This allows us to access user information (like user ID) in other parts of the application
        // We set req.user to an object containing the user's ID from the decoded token. This allows us to identify the authenticated user in subsequent middleware or route handlers.
        req.user = { _id: decoded.id };

        console.log("Decoded token : ", decoded);
        return next(); // Pass control to the next middleware function or route handler

        // If the token is invalid or verification fails, an error will be thrown and caught in the catch block below
    }catch(e){
        return res.status(400).json({
            message : "Invalid token" + e.message
        });
    }
};