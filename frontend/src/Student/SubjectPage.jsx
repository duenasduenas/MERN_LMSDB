import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookOpenIcon, UserIcon, ArrowLeftIcon, LogOutIcon, PenSquareIcon } from "lucide-react";
import RemoveSubject from "../components/RemoveSubject";

function SubjectPage() {
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
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subject...</p>
        </div>
      </div>
    );
  }

  if (!subject) return <p className="text-center text-gray-500">Subject not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOpenIcon className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Classroom</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/student/dashboard"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
              <RemoveSubject code={subject.code} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subject Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <BookOpenIcon className="w-12 h-12 text-blue-600 mr-4" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{subject.subject}</h2>
              <p className="text-gray-600">Subject Code: {subject.code}</p>
            </div>
          </div>
          <div className="flex items-center text-gray-700">
            <UserIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">Teacher: {subject.teacher?.name || subject.teacher || "N/A"}</span>
          </div>
        </div>

        {/* Class Stream Placeholder */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Class Stream</h3>
          <div className="text-center py-12">
            <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No announcements yet.</p>
            <p className="text-gray-400 mt-2">Check back later for updates from your teacher.</p>
          </div>
        </div>

          {subject.activity && subject.activity.length > 0 ? (
            <div className="space-y-4">
              {subject.activity.map((act) => (
                <Link
                  key={act._id}
                  to={`/submit-activity/${act._id}`}
                  className="group block border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <BookOpenIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600">{act.activity}</p>
                        <p className="text-sm text-gray-400">
                          Posted {new Date(act.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    

                  </div>

                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="w-14 h-14 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No activities yet</p>
              <p className="text-gray-400 mt-1">Create an activity to start classwork</p>
            </div>
          )}



      </main>
    </div>
  );
}

export default SubjectPage;
