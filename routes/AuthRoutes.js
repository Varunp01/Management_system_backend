import express from "express";
import { Login, Logout, Register } from "../controllers/authController.js";
import multer from "multer";
import { makeStorage, imageFileFilter } from "../config/multerCloudinary.js";
const router=express.Router();

const uploadProfile = multer({
    storage: makeStorage("officeManagementSystem/profile"),
    fileFilter: imageFileFilter,
}).single("myfile");

const uploadProfileMiddleware = (req, res, next) => {
    uploadProfile(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "File upload failed."
            });
        }
        next();
    });
};


// router.route("/register").post(multer({ storage: makeStorage("officeManagementSystem/profile") }).single("myfile"),Register);
router.route("/register").post(uploadProfileMiddleware, Register);
router.route("/login").post(Login);
router.route("/logout").get(Logout);
export default router;