import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

dotenv.config();

// The registerUser function is an asynchronous function that handles user registration requests. It takes in the request and response objects as parameters.
export const registerUser = async (req, res) => {
    try{
        // We extract the name, email, and password from the request body using destructuring assignment. This allows us to easily access these values for further processing.
        const{ name, email, password }= req.body;
        console.log("REQ BODY:", req.body);

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        // We check if a user with the provided email already exists in the database by using the User model to query the database. If a user is found, we return a 400 Bad Request response indicating that the user already exists.
        const existingUser = await User.findOne({email});

        if(existingUser)
            return res.status(400).json({msg : "User already exists"});

        // If the user does not already exist, we proceed to hash the password using bcrypt. The bcrypt.hash function takes the plain text password and a salt rounds value (in this case, 10) to generate a secure hashed password. We then create a new user instance using the User model, passing in the name, email, and hashed password. Finally, we save the user to the database.
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword});
        await user.save();

        // After successfully registering the user, we send a response back to the client indicating that the registration was successful. We include the user's ID, name, email, role, and plan in the response, along with a JWT token generated using the generateToken utility function. This token can be used for authentication in subsequent requests.
        // After successfully registering the user, we generate a JWT token for the user and include it in the response
        res.status(201).json({
        msg: "User registered successfully",
        token: generateToken(user),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        });
        console.log("User registered successfully:", user);
        console.log("Generated Token:", generateToken(user));
    }catch(e){
        res.status(500).json({
            msg : "Error registering user" + e.message
        });
        console.error("Error registering user:", e);
    }
}

// The loginUser function is an asynchronous function that handles user login requests. It also takes in the request and response objects as parameters.
export const loginUser = async (req, res) => {
    try{
        // We extract the email and password from the request body using destructuring assignment. This allows us to easily access these values for further processing.
        const {email,password} = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // We check if a user with the provided email exists in the database. If no user is found, we return a 400 Bad Request response indicating that the user does not exist.
        const user = await User.findOne({email});

        // If a user is found, we proceed to compare the provided password with the hashed password stored in the database using bcrypt.compare. If the passwords do not match, we return a 400 Bad Request response indicating that the credentials are invalid.
        if(!user)
            return res.status(400).json({
        msg : "User does not exist"});
        console.log("User found:", user);
        console.log("Comparing provided password with stored hashed password");

        // If the passwords match, we generate a JWT token for the user using the jwt.sign function. The token includes the user's ID, name, email, role, and plan as payload, and is signed with the JWT secret key defined in environment variables. The token is set to expire in 1 hour. Finally, we send a response back to the client indicating that the login was successful, along with the generated token.
        const valid = await bcrypt.compare(password, user.password);
        if(!valid)
            return res.status(400).json({
                msg : "Invalid Credentials"}
        );

        // If the credentials are valid, we generate a JWT token for the user using the generateToken utility function. This token will be included in the response sent back to the client, allowing the client to use it for authentication in subsequent requests.
        const token = generateToken(user);

        res.json({
            msg : "Login Successful", token
        });
        console.log("User logged in successfully:", user);
        console.log("Generated Token:", token);
    }catch(e){
        res.status(500).json({
            msg : "Error logging in user" + e.message
        })
        console.error("Error logging in user:", e);
    }
};

// The protectedRoute function is a simple route handler that sends a JSON response containing a message. The message includes the name of the authenticated user, which is accessed from the req.user object. This route is intended to be protected by the authMiddleware, meaning that only authenticated users with a valid JWT token can access it.
export const protectedRoute = (req,res) => {
    res.json({
        msg : `Hello, ${req.user.name}! This is a protected route. You are authorized to access this content.`
    });
    console.log("Accessed protected route by user:", req.user.name);
};

// The publicRoute function is similar to the protectedRoute function, but it is intended to be accessible to anyone, regardless of authentication status. It also sends a JSON response containing a message that includes the name of the user from the req.user object. However, since this route is public, it does not require authentication and can be accessed by anyone.
export const publicRoute = (req,res) => {
    res.json({
        msg : `This is a public route`
    });
    console.log("Accessed public route");
};