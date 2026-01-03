import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";

function SubmitActivity({ onSubmit }) {
  const [content, setContent] = useState("");
  const { activityId } = useParams();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = "http://localhost:5001/api/subject";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Content is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/submit-activity/${activityId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "You already submitted this activity");
        return;
      }

      alert("Activity submitted successfully");
      onSubmit?.(data);
      navigate(-1);

    } catch (error) {
        alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to class
        </button>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border"
      >
        
        {/* Title */}
        <div className="border-b px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Submit Activity
          </h1>
          <p className="text-sm text-gray-500">
            Add your work below
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Your work
          </label>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Type your answer or paste a file link here..."
            className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Attachment style hint */}
          <div className="text-xs text-gray-500">
            You can paste Google Drive links, file URLs, or text answers.
          </div>
        </div>

        {/* Submit bar */}
        <div className="flex justify-end items-center gap-3 border-t px-6 py-4 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Turn in"}
          </button>
        </div>

      </form>
    </main>
  );
}

export default SubmitActivity;
