import mongoose from "mongoose";
import { type } from "os";

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

      lesson: [
      {
         title: {
            type: String,
            required: true
         },
         lesson: { type: String },
         filePath: { type: String, required: true },
         summary: { type: String },
         summaryStatus: {
            type: String,
            enum: ["pending", "done", "failed"],
            default: "pending"
         },
         createdAt: { type: Date, default: Date.now }
      }
      ],


     
     isActive: {type: Boolean, default: true  }
     
  });

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;    