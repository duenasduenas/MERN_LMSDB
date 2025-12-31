import React, { useState } from "react";
import axios from "axios";

const EditActivity = ({ activityId, onClose, onUpdated }) => {
  const [activity, setActivity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5001/api/teacher";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${API_URL}/${activityId}/edit-activity`,
        { activity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdated(activity);
      onClose();
    } catch (err) {
      setError("Failed to update activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">
              Edit Activity
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <textarea
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Edit activity details..."
              className="w-full min-h-[120px] border rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditActivity;
