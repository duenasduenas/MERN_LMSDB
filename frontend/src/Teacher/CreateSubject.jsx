import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateSubject = ({ teacherId }) => {
  const [subject, setSubject] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Correct API base
  const API_URL = "http://localhost:5001/api/teacher";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teacherId) {
      setMessage("Teacher ID is missing.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${teacherId}/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ subject, code }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setTimeout(() => {
          navigate("/teacher/dashboard");
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Subject
      </h2>

      {message && (
        <p className="mb-4 text-center text-green-600 font-medium">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Subject Name:
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create Subject
        </button>
      </form>
    </div>
  );
};

export default CreateSubject;
