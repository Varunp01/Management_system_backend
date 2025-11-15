import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(401).json({
                message: "User with this emailId already exists",
                success: false
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 16);

        await User.create({ name, email, password: hashedPassword });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        })
    } catch (error) {
        console.log("Error in Registering User: ", error);
    }
}

export const Login = async (req,res)=>{
    try {
        let {email,password}=req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User does not exist",
                success: false
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect Password",
                success: false
            })
        }

        const tokenData={
            userId: user._id
        }
        const token=await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"});
        const cookieOptions={
            httpOnly: true,
            // secure: true,
            sameSite: true ? 'None' : 'Lax',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Correct cookie expiration
        };
        return res.status(201).cookie("token", token, cookieOptions).json({
            message: `${user.name} Logged in Successfully`,
            success: true
        })
    } catch (error) {
        console.log("Error in Logging User: ", error);
    }
}

export const Logout = async (req, res) => {
    return res.status(201).cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: `Logged out Successfully`,
        success: true
    })
}