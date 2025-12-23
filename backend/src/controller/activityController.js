import mongoose from "mongoose";
import Activity from "../models/Activity.js";
import Teacher from "../models/Teacher.js";
import Subject from "../models/Subject.js";
import Student from "../models/Student.js";

export async function getAllActivities(req, res) {
    try{
        const activity = await Activity.find().populate({path: "teacher student"}).sort({createAt: -1})
        res.status(200).json({activity})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export async function getActivityById(req, res) {
    try {
        const { activityId } = req.params;

        const activity = await Activity.findById(activityId)
            .populate("subject")  // populate subject details
            .populate("teacher")  // populate teacher details
            .populate("student"); // populate students

        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }

        res.status(200).json({ activity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}


export async function createActivities(req, res) {
    try {
        // Save Teacher
        const teacherId = req.user.id;
        const teacher = await Teacher.findById(teacherId)

        if(!teacher){
            return res.status(404).json({message:'Teacher not Found'})
        }
        
        // Save Subject
        const { subjectId } = req.params;
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(400).json({message: " Subject Not Found "});
        }

        // Save activity
        const { activity } = req.body;
        if(!activity) {
            return res.status(400).json({ message: "Activity is Required" })
        }  

        if(subject.teacher.toString() !== teacherId){
            return res.status(403).json({message: "Not your Subject"})
        }

        const newActivity = new Activity({
            activity, 
            subject,
            teacher: [teacherId]})

        const savedActivity = await newActivity.save()

        await Teacher.findByIdAndUpdate(teacherId,{
            $push: {activity: savedActivity._id}
        })

        await Subject.findByIdAndUpdate(subjectId, {
            $push: {activity: savedActivity._id}
        })

        res.status(201).json({
            message: "Activity is created and linked to teacher", 
            teacher,
            subject,
            activity: savedActivity
        })

    } catch (error){
        return res.status(500).json({message: error.message})
    }
}

export async function editActivity(req, res) {
    try{ 
        const { activity } = req.body;
        const activityId = req.params.id
        const editActivity = await Activity.findByIdAndUpdate(activityId, {activity})


        res.status(200).json({ message: "Activity Editted", editActivity })
    } catch (error){
        res.status(500)
    }
}


export async function deleteActivity(req, res) {
    try{
        const teacherId = req.user.id;
        const { activityId } = req.params

        const activity = await Activity.findById(activityId)
        if (!activity) {
            res.status(404).json({message: "Activity Not Found"})
        }

        if(!activity.teacher.includes(teacherId)){
            return res.status(403).json({ message: "Not Your Activity" })
        }

        await Teacher.findByIdAndUpdate(teacherId, {
            $pull: {activity: activityId}
        });

        if(activity.subject){
            await Subject.findByIdAndUpdate(activity.subject,{
                $pull: {activity: activityId}
            })
        }

        await Activity.findByIdAndDelete(activityId);

        res.json({ message: "Remove Activity Succesfully" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

