import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: Number, required: true },
    cost: { type: Number, required: true },
    maxSubscribers: { type: Number },
});

export const Course = mongoose.model("Course", CourseSchema);