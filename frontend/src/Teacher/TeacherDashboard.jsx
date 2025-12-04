import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function TeacherDashboard() {
  const [teacher, setTeacher] = useState({ subject: [] });
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
      }
    };
    getTeacher();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{teacher.name}'s Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Log Out
        </button>
      </div>

      {/* Subjects Section */}
      <div className="bg-white p-4 rounded shadow">

        {/* Section Header + Create Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Subjects</h2>

          <Link
            to={`/create-subject/${teacher._id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Create Subject
          </Link>
        </div>

        {teacher.subject.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacher.subject.map((subj) => (
              <Link
                key={subj._id}
                to={`/subject-teacher/${subj._id}`}
                className="block p-4 bg-gray-100 rounded hover:bg-gray-200 transition"
              >
                <h3 className="font-semibold text-lg">{subj.subject}</h3>
                <p className="text-gray-600">Code: {subj.code}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No subjects assigned yet.</p>
        )}
      </div>

    </div>
  );
}

export default TeacherDashboard;
