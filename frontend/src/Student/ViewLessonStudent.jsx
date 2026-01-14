import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ViewLessonStudent() {
  const { subjectId, lessonId, id } = useParams();

  const [subject, setSubject] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5001/api/subject/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSubject(res.data.subject);
      } catch (error) {
        console.error(error.response?.data || error.message);
        setError("Failed to fetch subject");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  if (loading) return <p className="text-center text-gray-600 mt-10">Loading lesson...</p>;
  if (error) return (
    <div className="text-center mt-10">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={() => navigate(-1)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mimicking Google Classroom */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Back button */}
            <Link
              to={`/subject-student/${subject._id}`}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Back to Subject</span>
            </Link>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">{subject?.name || "Subject"}</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Lessons</h2>
        
        {subject?.lesson?.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500 text-lg">No lessons uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subject.lesson.map((lesson) => (
              <Link
                key={lesson._id}
                to={`/${subject._id}/read-lesson-student/${lesson._id}`}
                className="block"
              >
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col justify-between h-full">
                  {/* Lesson icon */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {lesson.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Status: 
                        <span
                          className={`font-medium ml-1 ${
                            lesson.summaryStatus === "completed"
                              ? "text-green-600"
                              : "text-orange-500"
                          }`}
                        >
                          {lesson.summaryStatus}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Optional: Add a small description or due date if available */}
                  <div className="mt-auto">
                    <p className="text-xs text-gray-500">Click to view lesson</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewLessonStudent;