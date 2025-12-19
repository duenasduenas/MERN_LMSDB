import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BookOpenIcon, PlusIcon, LogOutIcon, UserIcon, SearchIcon } from "lucide-react";
import socket from "../socket";
import useStudentSocket from "../hooks/useStudentSocket";


function StudentDashboard() {
  const [student, setStudent] = useState({ subject: [] });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const navigate = useNavigate();

  // Fetch student data
  useEffect(() => {
    const getStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await axios.get("http://localhost:5001/api/student/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("STUDENT FETCHED:", res.data);
        setStudent(res.data.student);
      } catch (error) {
        console.log("Error fetching data:", error.response?.data || error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    getStudent();
  }, [navigate]);

  
    useEffect(() => {
      if (!student?.subject?.length) return;

      const joinRooms = () => {
        student.subject.forEach((subj) => {
          console.log("📡 Joining subject room:", subj._id);
          socket.emit("join-subject", subj._id);
        });
      };

      if (socket.connected) {
        joinRooms();
      } else {
        socket.on("connect", joinRooms);
      }

      return () => {
        socket.off("connect", joinRooms);
      };
    }, [student.subject]);



  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const enroll = async () => {
    if (!code) {
      alert("Please enter a Subject Code");
      return;
    }
    setEnrolling(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5001/api/student/enroll",
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Enrolled successfully!");
      // Refresh student subject after enrolling
      setStudent((prev) => ({
        ...prev,
        subject: [...prev.subject, res.data.subject],
      }));
      setCode("");
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }

    useStudentSocket(setStudent);
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
                <span className="font-medium">{student.name}</span>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {student.name}!</h2>
          <p className="text-gray-600">Enroll in subjects and start learning.</p>
        </div>

        {/* Enroll Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <PlusIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Enroll in a Subject</h3>
          </div>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Subject Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={enroll}
              disabled={enrolling}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {enrolling ? "Enrolling..." : "Enroll"}
            </button>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <BookOpenIcon className="w-6 h-6 text-gray-600 mr-2" />
            <h3 className="text-2xl font-semibold text-gray-900">My Subjects</h3>
          </div>

          {student.subject.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {student.subject.map((subj, index) => {
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
                    to={`/subject-student/${subj._id}`}
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
              <p className="text-gray-500 text-lg">No subjects enrolled yet.</p>
              <p className="text-gray-400 mt-2">Use a subject code to enroll in your first class.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
