import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { BookOpenIcon } from "lucide-react";
import axios from "axios";

export default function ViewLesson() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5001/api/subject/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Lessons</h1>
          <Link
            to={`/subject-teacher/${id}`}
            className="text-blue-600 hover:underline"
          >
            ← Back to Class
          </Link>
        </div>

        {subject?.lesson?.length > 0 ? (
          <div className="space-y-4">
            {subject.lesson.map((lesson) => (
              <div
                key={lesson._id}
                className="bg-white p-6 rounded-lg shadow border"
              >
                <h2 className="text-lg font-medium text-gray-800">
                  {lesson.title}
                </h2>

                <p className="text-sm text-gray-500 mt-2 whitespace-pre-line">
                  {lesson.summary || "Summary is still generating..."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpenIcon className="w-14 h-14 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No lessons found</p>
          </div>
        )}
      </div>
    </div>
  );
}
