import bcrypt from 'bcryptjs';
import { io } from "../server.js";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import Teacher from '../models/Teacher.js'
import Subject from '../models/Subject.js'
import Student from '../models/Student.js';




export async function createTeacherWithSubject(req,res){
    try{
      const body = req.body;
        const {name,email,password,subject,role, code} = body;

        if (!name || !email || !password) {
          return res.status(400).json({ message: "name, email and password are required" });
        }

        if (!subject || !code) {
          return res.status(400).json({ message: "subject and code are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        // Step 1: Create teacher
        const newTeacher = new Teacher({name,email,code,password:hashedPassword,role})
        const saveTeacher = await newTeacher.save()


        // Step 2: Create subject and link it to teacher
        const newSubject = new Subject({subject, code, 
            teacher: saveTeacher._id,
            subject
        })
        const saveSubject = await newSubject.save() 

        // Step 3: Push subject reference into teacher’s subject array
        saveTeacher.subject.push(saveSubject._id);
        await saveTeacher.save();
        

        // Step 4: Respond with both
        res.status(200).json({
            message: "Teacher and Subject Sucessfully Created",
            teacher: saveTeacher,
            subject: saveSubject
        })
    } catch (error){
        console.error("Error in creating Student and Subject:", error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export async function createSubjectByTeacherId(req, res) {
    try {
    // Save Teacher 
      const teacherId = req.params.teacherId;
      const teacher = await Teacher.findById(teacherId);
      if(!teacher){
        return res.status(404).json({message:'Teacher not Found'})
      }

    //   Save subject
      const { subject,code } = req.body;
      const newSubject = new Subject({
        subject,
        code,
        teacher: teacherId
      });
  
      const savedSubject = await newSubject.save();
  
      // Optional: push subject to teacher’s subject array
      await Teacher.findByIdAndUpdate(teacherId, {
        $push: { subject: savedSubject._id }
      });
  
      res.status(201).json({
        message: "Subject successfully created and linked to teacher",
        subject: savedSubject
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  export async function loginTeacher(req, res) {
    try {
        const { email, password } = req.body;

        const teacher = await Teacher.findOne({ email });
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) return res.status(400).json({ message: "Wrong credentials" });

        const token = jwt.sign(
            { id: teacher._id, role: "teacher" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            token,
            user: {
                id: teacher._id,
                name: teacher.name,
                role: "teacher"
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getAllSubjectTeacher(req,res){
    try{
        const teacher = await Teacher.find()
        .populate('student')
        .sort({createdAt: -1});

        res.status(200).json({teacher})
    } catch (error){
        res.status(500).json({message: error.message})
    }
}


export async function getSubjectTeacherById(req,res){
  try{
    const teacher = await Teacher.findById(req.user.id).populate("student subject");

    if(!teacher){
      return res.status(400).json({message: "Teacher not Found"})
    }

    res.status(200).json({message:"Teacher Found",
      teacher
    })
    
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}


export async function removeStudent(req, res) {
  try {
    const teacherId = req.user.id.toString();
    const { studentId, subjectId, activityId } = req.body;

    console.log("REQ BODY:", req.body);

    // validate ids
    if (!studentId || !subjectId
        || !mongoose.Types.ObjectId.isValid(studentId)
        // || !mongoose.Types.ObjectId.isValid(activityId)
        || !mongoose.Types.ObjectId.isValid(subjectId)) {
      return res.status(400).json({ message: "Invalid studentId or subjectId" });
    }

    // Find subject and check ownership (teacher)
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    if (subject.teacher?.toString() !== teacherId) {
      return res.status(403).json({ message: "You are not authorized to modify this subject" });
    }

    // Find student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // const activity = await Activity.findById(activityId)
    // if (!activity) {
    //   return res.status(404).json({ message: "Activity not found" });
    // }

    // Ensure arrays exist
    subject.student = subject.student || []; // your schema uses `student` array
    student.subject = student.subject || [];
    student.teacher = student.teacher || [];
    // student.activity = student.activity || [];

    // 1) Remove student from subject.student
    const beforeCount = subject.student.length;
    subject.student = subject.student.filter(sid => sid.toString() !== studentId);
    const afterCount = subject.student.length;

    // 2) Remove subjectId from student.subject
    student.subject = student.subject.filter(sid => sid.toString() !== subjectId);

    // Save subject and student
    await subject.save();
    await student.save();

    // 3) Optional cleanup: if the student is no longer in ANY subject taught by this teacher,
    //    remove the teacher <-> student relationship.
    //    Find whether the student still has any subject whose teacher is teacherId.
    const remainingSubjectWithThisTeacher = await Subject.exists({
      _id: { $in: student.subject },
      teacher: teacherId
    });

    let teacherChanged = false;
    let teacher = null;

    if (!remainingSubjectWithThisTeacher) {
      // Remove teacher reference from student.teacher
      student.teacher = student.teacher.filter(t => t.toString() !== teacherId);
      await student.save();

      // Also remove student from teacher.student if present
      teacher = await Teacher.findById(teacherId);
      if (teacher) {
        teacher.student = teacher.student || [];
        const prevLen = teacher.student.length;
        teacher.student = teacher.student.filter(sid => sid.toString() !== studentId);
        if (teacher.student.length !== prevLen) {
          teacherChanged = true;
          await teacher.save();
        }
      }
    } else {
      // if relationship remains, optionally populate teacher for return if you want
      teacher = await Teacher.findById(teacherId);
    }

      io.to(subjectId).emit("student-unenrolled", {
        subjectId,
        studentId,
      });

    return res.json({
      message: "Student unenrolled from subject",
      subject,
      student,
      teacher: teacherChanged || teacher ? teacher : undefined
    });
  } catch (err) {
    console.error("Error unenrolling student:", err);
    return res.status(500).json({ message: err.message });
  }
}


  export async function  unenrollSubject(req, res) {
    const teacherId = req.user.id;
    const { code } = req.body;
  
    try {
      // Find student and subject
      const teacher = await Teacher.findById(teacherId).populate({
        path: 'subject',
        select: 'subject code student' // <- must include code
      });
      const subject = await Subject.findOne({ code });
  
      if (!teacher || !subject) {
        return res.status(404).json({ message: "Student or Subject not found" });
      }
  
      // Remove the subject from student's subject
      teacher.subject = teacher.subject.filter(subj => subj._id.toString() !== subject._id.toString());
  
      // Remove the student from subject's student
      subject.student = subject.student.filter(id => id.toString() !== teacherId);
  
      // Save both
      await teacher.save();
      await subject.save();
  
      res.json({ message: "Unenrolled successfully", teacher, subject });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }