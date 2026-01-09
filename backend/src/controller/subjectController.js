import Student from "../models/Student.js";
import Subject from "../models/Subject.js";
import Teacher from "../models/Teacher.js";
import Activity from "../models/Activity.js";
import fs from "fs";

import { summarizeLesson } from "../services/aiServices.js";





export async function getAllSubjects(req,res){
    try{
        const subject = await Subject.find().populate({
            path: "teacher subject code isActive lesson",
            select: "name"
        }).sort({createdAt: -1})
        res.status(200).json({subject}) 
    } catch(error){
        res.status(400).json({message: error.message})
    }
}


export async function deleteSubject(req,res) {
    try{
        await Subject.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Delete Sucessful"})
    } catch (error) {
        console.log("Error Subject Cant Be Deleted")
    }
}

export async function getSubjectById(req,res){
    try{
        const subject = await Subject.findById(req.params.id)
            .populate({path: "student teacher activity",
                select: "name activity createdAt lesson"
            });
        
        if(!subject) {
            return res.status(400).json({message: "Subject Not Found"});
        }

        res.status(200).json({subject})
    } catch (error){
        res.status(500).json({message: error.message});
    }
}

export async function toggleEnrollement(req,res){
        const {subjectId} = req.body;

    try{
        const subject = await Subject.findById(subjectId)

        if(!subject) return res.status(400).json({message: "Subject Not Found"})
        
            
        subject.isActive =!subject.isActive
        
        await subject.save()

        return res.status(200).json({
            message: subject.isActive,
            subject
        })

    } catch (error){
        res.status(500).json({message: error.message})
    }
}

export async function addStudentToSubject(req,res){
    const teacherId = req.user.id;
    const { studentId, code} = req.body

    try{
        // Find the subject code
        const subject = await Subject.findOne({ code })
        .populate({
            path: "student",
            select: "subject"
        })

        if(!subject) return res.status(400).json({ message: "Subject Not Found" })

        if(subject.teacher.toString() !== teacherId) {
            return res.status(403).json({ message: "You are not allowed to add student to this subject" })
        }      

        const student = await Student.findById(studentId)
        if(!student) return res.status(400).json({ message: "Student Not Found" })    

        // prevent defaults
        if (subject.student.some(s => s._id.toString() === studentId)) {
            return res.status(400).json({ message: "Student already enrolled" });
        }     

        subject.student.push(studentId);
        student.subject.push(subject._id);

        await subject.save();
        await student.save();    

        res.status(200).json({ message: "Student added successfully", subject, student });

    } catch (error){
        return res.status(500).json({message: error.message})
    }

}

export async function createActivitiesToSubject(req, res){
    try{
        const teacherId = req.params.teacherId
        const teacher = await Teacher.findById(teacherId)

        if(!teacher){
            return res.status(404).json({ message: "Teacher Not Found" })
        }

        const {activity} = req.body;

        const newActivity = new Activity({
            activity, 
            teacher: teacherId});

        const savedActivity = await newActivity.save()

        await Teacher.findByIdAndUpdate(teacherId, {
            $push: {activity: savedActivity._id}
        })

        res.status(201).json({
            message: "Activity succesfully created and linked to the teacher",
            message: savedActivity
        })

    }catch (error){
        res.status(500).json({message: error.message})
    }
}

export async function editSubject(req, res) {
    try{
        const {subject, code } = req.body
        const editSubject = await Subject.findByIdAndUpdate(req.params.id, {subject, code})

        res.status(200).json({message: "Subject Editted", editSubject})
        

    } catch (error){    
        res.status(500)
    }
}



export const uploadLesson = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Lesson title is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "File is required" });
    }

    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // 1️⃣ Push lesson WITH TITLE
    req.files.forEach(file => {
      subject.lesson.push({
        title: title,
        filePath: file.path,
        summaryStatus: "pending"
      });
    });

    // 2️⃣ Save (MongoDB assigns _id)
    await subject.save();

    // 3️⃣ Get saved lessons
    const addedLessons = subject.lesson.slice(-req.files.length);

    // 4️⃣ Background summarization
    addedLessons.forEach(lesson => {
      summarizeLesson(lesson._id, lesson.filePath, subject._id);
    });

    res.status(201).json({
      message: "Lesson uploaded. Summarization in progress.",
      lessons: addedLessons
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};


export async function deleteLesson(req,res) {
    const { subjectId, lessonId } = req.params

    try{

        await Subject.updateOne(
            { _id: subjectId },
            { $pull: {lesson: {_id: lessonId}} }
        );

        res.status(200).json({message: "Delete Sucessful"})
    } catch (error) {
        console.log("Error Lesson Cant Be Deleted")
    }
}

export async function getLesson(req, res) {
  const { subjectId, lessonId } = req.params;

  try {
    const subject = await Subject.findById(subjectId).select("lesson");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const lesson = subject.lesson.id(lessonId)// 👈 Mongoose subdoc lookup

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({
      message: "Lesson found",
      lesson,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

