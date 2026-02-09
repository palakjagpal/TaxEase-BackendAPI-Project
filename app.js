import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import connectDb from "./config/db.js";

dotenv.config();

// Connect to MongoDB using the connection string defined in environment variables
const app = express();

// Use the authentication routes defined in authRoutes.js for any requests to the "/api/auth" endpoint
app.use(express.json());
// This line sets up the Express application to parse incoming requests with URL-encoded payloads. The extended: true option allows for rich objects and arrays to be encoded into the URL-encoded format, which can be useful for handling complex data structures in form submissions.
app.use(express.urlencoded({ extended: true }));

// Enable CORS (Cross-Origin Resource Sharing) to allow requests from different origins
app.use(cors());

// Call the connectDb function to establish a connection to the MongoDB database
connectDb();

// This line sets up the Express application to use the authentication routes defined in authRoutes.js for any requests that start with "/api/auth". For example, if a client sends a request to "/api/auth/register", it will be handled by the corresponding route defined in authRoutes.js.
app.use("/api/auth", authRoutes);

// Define a simple route for the root URL ("/") that sends a response indicating that the API is running. This is a basic health check endpoint to verify that the server is up and running.
app.get("/", (req, res) => {
    res.send("TaxEase Auth API is running...");
})

// Define the port on which the server will listen for incoming requests. It first checks if a PORT environment variable is defined (which is common in production environments), and if not, it defaults to port 5000.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
    console.log(`Server is running on port http://localhost:${PORT}`)
);

