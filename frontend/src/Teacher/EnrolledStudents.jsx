import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { UsersIcon, TrashIcon, ArrowLeftIcon, BookOpenIcon } from "lucide-react";
import removeStudent from "../components/RemoveStudent.jsx";

export default function EnrolledStudents() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5001/api/subject/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const handleRemoveLocal = (studentId) => {
    setSubject((prev) => ({
      ...prev,
      student: prev.student.filter((s) => s._id !== studentId),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Classroom</h1>
          </div>
          <Link
            to={`/subject-teacher/${id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back to Subject
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Students Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6 gap-2">
            <UsersIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-semibold text-gray-900">Enrolled Students</h3>
            {subject?.student && subject.student.length > 0 && (
              <span className="text-sm text-gray-500 ml-2">({subject.student.length})</span>
            )}
          </div>
          {subject?.student && subject.student.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subject.student.map((stud) => (
                <div
                  key={stud._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {stud.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{stud.name}</span>
                      <p className="text-sm text-gray-500">Student</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeStudent(stud._id, subject._id, handleRemoveLocal)}
                    className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" /> Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No students enrolled yet.</p>
              <p className="text-gray-400 mt-2">Share the subject code to let students join.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}