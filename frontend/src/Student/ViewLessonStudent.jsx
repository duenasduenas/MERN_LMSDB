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
  const navigate = useNavigate()

  
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
        alert("Failed to fetch subject");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);



  if (loading) return <p>Loading lesson...</p>;
  if (error) return <p className="text-red-600">{navigate(-1)} </p>;

  return (
    <div className="space-y-4">
          {subject.lesson.length === 0 && (
            <p className="text-gray-500 text-sm">
              No lessons uploaded yet.
            </p>
          )}

          {subject.lesson.map((lesson) => (

           <Link
            key={lesson._id}
            to={`/${subject._id}/read-lesson-student/${lesson._id}`}
           >
               <div
              key={lesson._id}
              className="bg-white rounded-lg border shadow-sm p-5 flex justify-between items-center"
            >
                <div>
                  <h4 className="text-lg font-medium text-gray-800">
                    {lesson.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={`font-medium ${
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
           </Link>
              
          ))}
        </div>
  )
}

export default  ViewLessonStudent;
