import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    taskTitle: {
        type: String,
        required: true,
        trim: true
    },
    taskDescription: {
        type: String,
        required: true,
        trim: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    viewers: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    }],
    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo",
        required: true,
    }
}, { timestamps: true });
export const Tasks = mongoose.model("Tasks", taskSchema);