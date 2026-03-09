import express from "express";
import {getAllUsers, deleteUser} from "../controllers/adminController.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";
import {adminMiddleware} from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/users",authMiddleware,adminMiddleware,getAllUsers);
router.delete("/users/:id",authMiddleware,adminMiddleware,deleteUser);

export default router;

/*
GET    /api/admin/users
DELETE /api/admin/users/:id
*/