import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
    path: "../config/.env"
})

const databaseConnect = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Database connected");
    }).catch((err) => {
        console.log(`error in database: ${err}`);
    })
}

export default databaseConnect;