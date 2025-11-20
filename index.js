import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config({
    path: ".env"
})

import databaseConnect from "./config/database.js";
databaseConnect();

//middlewares
import cookieParser from "cookie-parser";
app.use(cookieParser());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

import cors from 'cors';
const corsOptions = {
    // origin: 'https://management-system-backend.vercel.app',
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

app.get("/",(req,res)=>{
    res.send("<h1>Home Page</h1>");
});

import AuthRoutes from "./routes/AuthRoutes.js";
app.use("/api/v1/auth",AuthRoutes);

import OrganizationRoutes from "./routes/OrganizationRoutes.js";
app.use("/api/v1/org",OrganizationRoutes);

import MemberRoutes from "./routes/MemberRoutes.js";
app.use("/api/v1/org",MemberRoutes);

import TaskRoutes from "./routes/TaskRoutes.js";
app.use("/api/v1/org",TaskRoutes);

app.listen(process.env.PORT, () => {
    console.log("server started", process.env.PORT);
})