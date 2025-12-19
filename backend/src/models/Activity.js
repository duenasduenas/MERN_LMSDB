import mongoose from "mongoose";
import { type } from "os";

const activitySchema = new mongoose.Schema({
    activity:{
        type:String
    },

    teacher: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    }],

    student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],

    subject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    }]
}, {timestamps: true})

const Activity = mongoose.model('Activity', activitySchema)
export default Activity;