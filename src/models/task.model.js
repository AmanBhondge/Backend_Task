import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "inProgress", "completed"]
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
