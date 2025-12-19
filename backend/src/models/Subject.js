import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    subject: { type: String, unique: true},
    code: { type: String, unique: true },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },

    student: [{ type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
     }],

     activity: [{ type: mongoose.Schema.Types.ObjectId,
        ref: "Activity"
     }],
     
     isActive: {type: Boolean, default: true  }
     
  });

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;    