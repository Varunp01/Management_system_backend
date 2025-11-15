import mongoose from "mongoose";
const memberSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    userInfo: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        role: {
            type: String,
            enum: ["owner", "member"],
        }
    }]
}, { timestamps: true });
export const Members = mongoose.model("Members", memberSchema);