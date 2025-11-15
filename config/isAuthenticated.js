import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({
    path: "../config/.env"
})

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not Authenticated. Login Again",
                success: false
            });
        }

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decodedToken.userId;
        next();
    } catch (error) {
        console.log("Authentication Error:", error.message);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Session expired. Please log in again.",
                success: false
            })
        }
        return res.status(401).json({
            message: "Invalid token.",
            success: false
        });
    }
}