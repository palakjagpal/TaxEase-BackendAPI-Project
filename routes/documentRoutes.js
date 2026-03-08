import express from "express";

import{
    uploadDocument,getDocuments, updateDocuments, deleteDocument
} from "../controllers/documentController.js";

import {uploadMiddleware} from "../middlewares/uploadMiddleware.js";

import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, uploadMiddleware, uploadDocument);
router.get("/",authMiddleware,getDocuments);
router.put("/:id",authMiddleware,updateDocuments);
router.delete("/:id",authMiddleware,deleteDocument);

export default router;

/*
| Action          | Method | Route                |
| --------------- | ------ | -------------------- |
| Upload document | POST   | `/api/documents`     |
| List documents  | GET    | `/api/documents`     |
| Update document | PUT    | `/api/documents/:id` |
| Delete document | DELETE | `/api/documents/:id` |
*/