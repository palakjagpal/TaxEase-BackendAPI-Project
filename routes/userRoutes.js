import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

// User routes
const userRoutes = express.Router();
// Get user profile
userRoutes.get("/profile", authMiddleware, getProfile);
// Update user profilez
userRoutes.put("/profile", authMiddleware, updateProfile);

export default userRoutes;
