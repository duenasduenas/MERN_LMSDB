import Submission from "../models/Submission.js";
import Activity from "../models/Activity.js";

export const submitActivity = async (req, res) => {
  try {
    const studentId = req.user.id; // from JWT
    const { activityId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Submission content is required" });
    }

    // 1️⃣ Check if activity exists
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // 2️⃣ Check if student is assigned to this activity
    const isAssigned = activity.students.some(
      (id) => id.toString() === studentId
    );

    if (!isAssigned) {
      return res.status(403).json({ message: "You are not assigned to this activity" });
    }

    // 3️⃣ Determine submission status
    let status = "submitted";
    if (activity.dueDate && new Date() > activity.dueDate) {
      status = "late";
    }

    // 4️⃣ Create submission
    const submission = await Submission.create({
      activity: activityId,
      student: studentId,
      content,
      status
    });

    res.status(201).json({
      message: "Activity submitted successfully",
      submission
    });

  } catch (error) {

    // Duplicate submission error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already submitted this activity"
      });
    }

    res.status(500).json({
      error: error.message
    });
  }
};