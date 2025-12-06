import express from 'express';
import upload from "../config/multerConfig.js";
import { deleteFile, getAllFiles, getFilesById, updateFile, uploadFile } from '../controllers/multerfileController.js';
const router=express.Router();

router.post("/upload", upload.single("myfile"),uploadFile);

router.get("/files",getAllFiles);
router.get("/files/:id",getFilesById);

router.put("/files/:id", upload.single("myfile"), updateFile);

router.delete("/filesdelete/:id", deleteFile);

export default router;