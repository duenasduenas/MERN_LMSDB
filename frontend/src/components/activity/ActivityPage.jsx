import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BookOpenIcon, UsersIcon } from "lucide-react";

function ActivityPage() {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  const activityId = window.location.pathname.split("/").pop();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/subject/activity/${activityId}`
        );
        console.log("API Response:", res.data);
        setActivity(res.data.activity);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch activity");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading activity...</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Activity not found</p>
        <Link
          to="/teacher/dashboard"
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Back
        </Link>
      </div>
    );
  }

  // Access first element of arrays
  const subject = activity.subject?.[0];
  const teacher = activity.teacher?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{activity.activity}</h1>
            <span className="inline-block mt-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
              {subject?.subject || "No Subject"}
            </span>
          </div>

          {subject?._id && (
            <Link
              to={`/subject-teacher/${subject._id}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Class
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Teacher Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher</h3>
          <p className="text-gray-800">{teacher?.name || "No teacher assigned"}</p>
          <p className="text-sm text-gray-500">{teacher?.email || ""}</p>
        </div>

        {/* Students Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-gray-600" />
            Students
          </h3>

          {!activity.student || activity.student.length === 0 ? (
            <p className="text-gray-500">No students enrolled</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activity.student.map((s) => (
                <li
                  key={s._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-800 font-medium">{s.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default ActivityPage;
