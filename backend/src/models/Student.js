import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email: {
        type:String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'teacher'],
        default: 'student'
    },

     // Teachers who handle this student
    teacher: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
    }],

     // Subjects enrolled by the student
    subject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    }],

    activity: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity"
    }]
   
}, { timestamps: true })

const Student = mongoose.model('Student',studentSchema);

export default Student;