import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BookOpenIcon, PlusIcon, LogOutIcon, UserIcon } from "lucide-react";

function TeacherDashboard() {
  const [teacher, setTeacher] = useState({ subject: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getTeacher = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5001/api/teacher/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("TEACHER FETCHED:", res.data);
        setTeacher(res.data.teacher);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data || error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    getTeacher();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center text-gray-700">
                <UserIcon className="w-5 h-5 mr-2" />
                <span className="font-medium">{teacher.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOutIcon className="w-5 h-5 mr-2" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {teacher.name}!</h2>
          <p className="text-gray-600">Manage your subjects and engage with your students.</p>
        </div>

        {/* Subjects Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">My Subjects</h3>
            <Link
              to={`/create-subject/${teacher._id}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-md"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Subject
            </Link>
          </div>

          {teacher.subject.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacher.subject.map((subj, index) => {
                const colors = [
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-purple-500",
                  "bg-yellow-500",
                  "bg-red-500",
                  "bg-indigo-500",
                ];
                const colorClass = colors[index % colors.length];
                return (
                  <Link
                    key={subj._id}
                    to={`/subject-teacher/${subj._id}`}
                    className={`block p-6 ${colorClass} text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                  >
                    <div className="flex items-center mb-4">
                      <BookOpenIcon className="w-8 h-8 mr-3" />
                      <h4 className="text-xl font-semibold">{subj.subject}</h4>
                    </div>
                    <p className="text-white text-opacity-90">Code: {subj.code}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No subjects assigned yet.</p>
              <p className="text-gray-400 mt-2">Create your first subject to get started.</p>
            </div>
          )}
        </div>
      </main>

      
    </div>
  );
}

export default TeacherDashboard;
