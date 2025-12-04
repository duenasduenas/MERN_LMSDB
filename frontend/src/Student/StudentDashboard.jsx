import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function StudentDashboard() {
  const [student, setStudent] = useState({ subject: [] });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
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
      }
    };
    getStudent();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const enroll = async () => {
    if (!code) return alert("Please enter a Subject Code");
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-blue-500 to-green-500 relative overflow-hidden">
      {/* Background elements for sports feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJzdHJpcGVzIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPgogICAgICA8cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSI0MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MCUiIGhlaWdodD0iNDAiIGZpbGw9InVybCgjc3RyaXBlcykiLz4KPC9zdmc+')] opacity-20"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
            🏅 {student.name}'s Dashboard 🏅
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
          >
            🚪 Log Out
          </button>
        </div>

        <div className="mb-6 bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gray-800">🎯 Enroll in a Subject</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Subject Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="px-4 py-2 border rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
            />
            <button
              onClick={enroll}
              disabled={loading}
              className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {loading ? "Enrolling..." : "🚀 Enroll"}
            </button>
          </div>
        </div>

        <hr className="my-6 border-white opacity-50" />

        <div>
          <h2 className="text-2xl font-bold mb-4 text-white drop-shadow-md">🏆 My Subjects</h2>
          {student.subject.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {student.subject.map((subj) => (
                <Link key={subj._id} to={`/subject-student/${subj._id}`}>
                  <div className="p-6 bg-white bg-opacity-90 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-yellow-400">
                    <h3 className="text-lg font-bold text-gray-800">{subj.subject}</h3>
                    <p className="text-gray-600 font-semibold">Code: {subj.code}</p>
                    <div className="mt-2 text-yellow-600">⚽ Click to Play!</div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-200 text-lg font-semibold">No subjects enrolled yet. Time to join the game! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
