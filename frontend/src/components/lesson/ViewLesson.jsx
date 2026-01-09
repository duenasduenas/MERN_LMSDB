import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewLesson() {
  const { subjectId, lessonId } = useParams();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  try{
      useEffect(() => {
        const fetchLesson = async () => {
        try {
            const res = await axios.get(
            `http://localhost:5001/api/subject/${subjectId}/view-lesson/${lessonId}`
            );
            setLesson(res.data.lesson);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch lesson");
        } finally {
            setLoading(false);
        }
        };

        fetchLesson();
    }, [subjectId, lessonId]);
  } catch (err){
    navigate(-1)
  }


  if (loading) return <p>Loading lesson...</p>;
  if (error) return <p className="text-red-600">{navigate(-1)} </p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link
        to={`/upload-lesson/${subjectId}`}
        className="text-blue-600 hover:underline"
      >
        ← Back to lessons
      </Link>

      <h2 className="text-2xl font-semibold mt-4 mb-2">
        Lesson Details
      </h2>

      
      <p className="mb-2">
        <strong>Title:</strong> {lesson.title}
      </p>

      <p className="mb-4">
        <strong>Status:</strong> {lesson.summaryStatus}
      </p>

      {/* ✅ Properly aligned AI summary */}
      <div className="mt-4">
        <strong>Description:</strong>
        <p className="text-justify leading-relaxed whitespace-pre-line mt-2">
          {lesson.summary}
        </p>
      </div>

      {lesson.content && (
        <div className="mt-6">
          <strong>Content:</strong>
          <p className="leading-relaxed whitespace-pre-line mt-2">
            {lesson.content}
          </p>
        </div>
      ) }
    </div>
  );
}

export default ViewLesson;
