// backend/services/aiService.js
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import Subject from '../models/Subject.js';

export const summarizeLessonBackground = async (lessonId, filePath, subjectId) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("query", "Summarize the key points of this lesson for students");

    const response = await axios.post(
      "http://localhost:8001/rag-summarize",
      formData,
      { headers: formData.getHeaders() }
    );

    await Subject.updateOne(
      { _id: subjectId, "lesson._id": lessonId },
      {
        $set: {
          "lesson.$.summary": response.data.summary,
          "lesson.$.summaryStatus": "done"
        }
      }
    );
  } catch (err) {
    console.error("Background summarization failed:", err.message);
    await Subject.updateOne(
      { _id: subjectId, "lesson._id": lessonId },
      { $set: { "lesson.$.summaryStatus": "failed" } }
    );
  }
};
