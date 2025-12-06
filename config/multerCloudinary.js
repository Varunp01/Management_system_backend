import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

export const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
};

export const makeStorage = (folderName) => {
    return new CloudinaryStorage({
        cloudinary,
        params: {
            folder: folderName,
            resource_type: "auto",
            public_id: (req, file) => {
                const ext = file.originalname.split(".").pop();
                return `${Date.now()}_${Math.floor(Math.random() * 9999)}.${ext}`;
            }
        }
    });
};

export const uploadMultiple = multer({
    storage: makeStorage("generalUploads"),
    fileFilter: imageFileFilter
});