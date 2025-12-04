import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditSubject = ({ subjectId }) => {
  const [subject, setSubject] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5001/api/subject";
  const navigate = useNavigate();

  // Fetch existing subject data
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (!subjectId) return;
        const res = await fetch(`${API_URL}/${subjectId}`);
        if (!res.ok) throw new Error(`Failed to fetch subject (${res.status})`);
        const data = await res.json();

        setSubject(data.subject || "");
        setCode(data.code || "");
      } catch (err) {
        console.error(err);
        setMessage(err.message);
      }
    };
    fetchSubject();
  }, [subjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/${subjectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, code }),
      });
      const data = await res.json();
      setMessage(data.message || (res.ok ? "Subject updated" : "Failed to update"));

      if (res.ok) {
        // Redirect back to the subject page after 1.5 seconds
        setTimeout(() => {
          navigate(`/subject-student/${subjectId}`);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred");
    }
  };

  const handleCancel = () => {
    navigate(`/subject-student/${subjectId}`); // go back without saving
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-blue-500 to-green-500 relative overflow-hidden">
      {/* Background elements for sports feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJzdHJpcGVzIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPgogICAgICA8cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSI0MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MCUiIGhlaWdodD0iNDAiIGZpbGw9InVybCgjc3RyaXBlcykiLz4KPC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 flex items-center justify-center min-h-full">
        <div className="max-w-md w-full p-8 bg-white bg-opacity-90 shadow-lg rounded-lg border-2 border-yellow-400">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 drop-shadow-md">
            ⚽ Edit Subject ⚽
          </h2>

          {message && (
            <p className="mb-4 text-center text-green-600 font-semibold bg-green-100 p-2 rounded-md">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Subject Name:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full border border-gray-300 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Code:</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full border border-gray-300 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                💾 Save Changes
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-400 text-white font-bold py-3 rounded-full hover:bg-gray-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSubject;
