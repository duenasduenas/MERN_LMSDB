import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { BookOpenIcon } from "lucide-react";

function CreateActivity() {
  const [activity, setActivity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { subjectId } = useParams();
  const navigate = useNavigate();

  const API_URL = "http://localhost:5001/api/teacher";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activity.trim()) {
      setMessage("Activity title is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/${subjectId}/create-activity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ activity }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to create activity");
        return;
      }

      // ✅ Go back to subject page after success
      navigate(`/subject-teacher/${subjectId}`);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">
              Create Activity
            </h1>
          </div>

          {/* ✅ Back always works */}
          <Link
            to={`/subject-teacher/${subjectId}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Class
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity title
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 1 Assignment"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <p className="text-sm text-red-500">{message}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateActivity;
