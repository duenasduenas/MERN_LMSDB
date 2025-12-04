import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
      type: String,
      required: true,
      unique: true
    },
    password:{
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'teacher'],
      default: 'teacher'
    },

     // Student this teacher teaches
    student: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Student'
      }
     ],

    // Subject handled by the teacher
    subject: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject',  // ✅ make sure this matches your model name
        }
      ],
},{timestamps:true})



const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;    