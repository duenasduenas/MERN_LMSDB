import mongoose from "mongoose";

const submitSchema = new mongoose.Schema({
    activity:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true
    },

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    content: {
        type: String
    },

    submittedAt: {
        type: Date,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["Submitted", "Late", "Pending"],
        default: ["Pending"]
    },

    grade: Number,
    feedback: String

}, {timestamps: String})

submitSchema.index({ activity: 1, student: 1 }, { unique: true });

const Submitted = mongoose.model("Submitted", submitSchema)

export default Submitted;