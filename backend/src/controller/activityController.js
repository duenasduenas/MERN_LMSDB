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

        const activity = await Activity.findById(activityId).populate({path: "student subject teacher",
            select: "activity subject name"
         })


        if (!activity) {
            return res.status(404).json({ message: "Activity not found" });
        }

        res.status(200).json({ activity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// export async function getActivityBySubjectId(req, res) {
//     const {subjectId} = req.params;
//     const {studentId} = req.user.id;

//     try{
//         const subject = await Subject.findById(subjectId).populate({path: "activity"})
//         if(!subject ||) {
//             return res.status(400).json({message: "Subject not Found"})
//         }

//         const activity = await activity.find({subject: subjectId}).populate("teacher subject")
//         res.status(200).json({message: "Activity is found", activity})

//     } catch (err){
//         return res.status(500).json({message: err.message});
//     }
// }


export async function createActivities(req, res) {
    try {
        // Save Teacher
        const teacherId = req.user.id;
        const teacher = await Teacher.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not Found' });
        }
        
        // Save Subject (populate students)
        const { subjectId } = req.params;
        const subject = await Subject.findById(subjectId).populate({path: "student"});  // Confirm 'students' is your field name (plural)
        if (!subject) {
            return res.status(400).json({ message: "Subject Not Found" });
        }

        // Save activity
        const { activity } = req.body;
        if (!activity) {
            return res.status(400).json({ message: "Activity is Required" });
        }  

        if (subject.teacher.toString() !== teacherId) {
            return res.status(403).json({ message: "Not your Subject" });
        }

        // Extract student IDs for the activity
        const studentIds = subject.student ? subject.student.map(s => s._id) : [];

        const newActivity = new Activity({
            activity, 
            subject: subjectId,  // Use ID for consistency
            teacher: [teacherId],
            student: studentIds  // Set the student field with enrolled student IDs
        });

        const savedActivity = await newActivity.save();

        // Update Teacher
        await Teacher.findByIdAndUpdate(teacherId, {
            $push: { activity: savedActivity._id }
        });

        // Update Subject
        await Subject.findByIdAndUpdate(subjectId, {
            $push: { activity: savedActivity._id }
        });

        // Link to enrolled students (bulk update for efficiency)
        if (subject.student && subject.student.length > 0) {
            const bulkOps = subject.student.map(student => ({
                updateOne: {
                    filter: { _id: student._id },
                    update: { $push: { activity: savedActivity._id } }
                }
            }));
            await Student.bulkWrite(bulkOps);
        }

        // Populate the activity for the response (including students)
        const populatedActivity = await Activity.findById(savedActivity._id)
            .populate('teacher')  // Populate teacher details
            .populate('subject')  // Populate subject details
            .populate('student'); // Populate student details

        res.status(201).json({
            message: "Activity is created and linked to teacher, subject, and enrolled students", 
            teacher,
            subject,
            activity: populatedActivity  // Send the populated activity
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
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
        const { activityId } = req.params
        const teacherId = req.user.id;

        const activity = await Activity.findById(activityId)
        if (!activity) {
            res.status(404).json({message: "Activity Not Found"})
        }

        if(activity.subject){
            await Subject.findByIdAndUpdate(activity.subject,{
                $pull: {activity: activityId}
            })
        }

        if(!activity.teacher.includes(teacherId)){
            return res.status(403).json({ message: "Not Your Activity" })
        }

         // Remove from Subject (handle if subject is an array of IDs)
        if (activity.subject && activity.subject.length > 0) {
            for (const subjId of activity.subject) {
                await Subject.findByIdAndUpdate(subjId, {
                    $pull: { activity: activityId }
                });
            }
        }

        await Teacher.findByIdAndUpdate(teacherId, {
            $pull: {activity: activityId}
        });

        // Remove from ALL enrolled Students (bulk update for efficiency)
        if (activity.student && activity.student.length > 0) {
            const bulkOps = activity.student.map(studentId => ({
                updateOne: {
                    filter: { _id: studentId },
                    update: { $pull: { activity: activityId } }  // Correctly pull activityId
                }
            }));
            await Student.bulkWrite(bulkOps);
        }

        await Activity.findByIdAndDelete(activityId);

        res.json({ message: "Remove Activity Succesfully"})

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

