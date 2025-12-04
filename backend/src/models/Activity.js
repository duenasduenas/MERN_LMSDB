import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
    activity:{
        type:String
    },

    teacher: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    }]
}, {timestamps: true})

const Activity = mongoose.model('Activity', ActivitySchema)
export default Activity;