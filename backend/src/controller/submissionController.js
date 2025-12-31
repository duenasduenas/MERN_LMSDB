import Submission from "../models/Submission.js";
import Activity from "../models/Activity.js";

export async function submitActivity(req, res) {
    const studentId = req.user.id;
    const { activityId } = req.params
    const { content } = req.body;

    try{
        if(!content){
            return res.status(400).json({message: "Submit is required and not must be empty"})
        }

        const activity = await Activity.findById(activityId)
        if(!activity){
            return res.status(400).json({message: "Activity is not found"});
        }

        const isAssigned = activity.student.some((id) => id.toString() === studentId);

        if(!isAssigned){
            return res.status(403).json({message: "Youre are not assigned to this activity"})
        }

        let status = "Submitted"
        if(activity.dueDate && new Date() > activity.dueDate) {
            status = "Late";
        }

        const submitted = await Submission.create({
            activity: activityId,
            student: studentId,
            content,
            status
        });

        res.status(201).json({
            message: "Activity submitted successfully",
            submitted
        })

    } catch (err){
        return res.status(500).json({message: err.message})
    }

    if(error.code === 11000){
        return res.status(409).json({
            message: "You have submitted Already"
        });
    }
}