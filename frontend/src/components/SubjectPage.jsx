import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import UnenrollBtn from "../components/UnenrollBtn.jsx";
import EditSubject from "./EditSubject.jsx";

function SubjectPage() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);

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
      }
    };

    fetchSubject();
  }, [id]);

  if (!subject) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-green-500">
      <p className="text-white text-xl font-bold">🏈 Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-blue-500 to-green-500 relative overflow-hidden">
      {/* Background elements for sports feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJzdHJpcGVzIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPgogICAgICA8cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSI0MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MCUiIGhlaWdodD0iNDAiIGZpbGw9InVybCgjc3RyaXBlcykiLz4KPC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 flex items-center justify-center min-h-full">
        <div className="max-w-lg w-full p-8 bg-white bg-opacity-90 shadow-lg rounded-lg border-2 border-yellow-400">
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/student/dashboard"
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-2"
            >
              ← Back to Dashboard
            </Link>

            <div className="flex gap-2">
              <UnenrollBtn code={subject.code} />
              {/* Optional edit button, if needed */}
              <Link
                to={`/edit-subject/${subject._id}`}
                className="text-yellow-600 hover:text-yellow-800 p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 transition-all duration-300 transform hover:scale-110 shadow-md"
              >
                <PenSquareIcon size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold mb-4 text-gray-800 drop-shadow-md">
              🏀 {subject.subject} 🏀
            </h2>
            <p className="text-gray-700 mb-2 font-semibold">Code: {subject.code}</p>
            <p className="text-gray-700 font-semibold">
              Coach: {subject.teacher?.name || subject.teacher || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectPage;
