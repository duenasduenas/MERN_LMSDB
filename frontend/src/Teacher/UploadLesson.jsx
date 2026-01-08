import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router";
import DeleteLesson from "../components/subject/deleteLesson";

const UploadLesson = () => {
  const { id } = useParams(); // subjectId
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [updating, setUpdating] = useState(false);

  // 🔹 FETCH SUBJECT DETAILS
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5001/api/subject/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSubject(res.data.subject);
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert("Failed to fetch subject");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  // 🔹 UPLOAD LESSON
  const handleUpload = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);

      for (let file of files) {
        formData.append("files", file); // must match multer
      }

      const res = await axios.post(
        `http://localhost:5001/api/subject/upload-lesson/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(res.data);
      alert("Lesson uploaded. Summarization in progress.");

      navigate(-1); // go back

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Upload failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Class Lessons
          </h1>

          <Link
            to={`/subject-teacher/${id}`}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            ← Back to Class
          </Link>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Upload New Lesson
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="text"
              placeholder="Lesson title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={(e) => setFiles([...e.target.files])}
              className="block w-full text-sm text-gray-600"
              required
            />

            <button
              type="submit"
              disabled={updating}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {updating ? "Uploading..." : "Upload Lesson"}
            </button>
          </form>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {subject.lesson.length === 0 && (
            <p className="text-gray-500 text-sm">
              No lessons uploaded yet.
            </p>
          )}

          {subject.lesson.map((lesson) => (

           <Link
            key={lesson._id}
            to={`/view-lesson/${id}`}
           >
               <div
              key={lesson._id}
              className="bg-white rounded-lg border shadow-sm p-5 flex justify-between items-center"
            >
                <div>
                  <h4 className="text-lg font-medium text-gray-800">
                    {lesson.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        lesson.summaryStatus === "completed"
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {lesson.summaryStatus}
                    </span>
                  </p>
                </div>

                <DeleteLesson
                  subjectId={subject._id}
                  lessonId={lesson._id}
                  onDeleted={(deletedId) => {
                    setSubject((prev) => ({
                      ...prev,
                      lesson: prev.lesson.filter(
                        (l) => l._id !== deletedId
                      ),
                    }));
                  }}
                />
              </div>
           </Link>
              
          ))}
        </div>
      </div>
    </div>
  );

};

export default UploadLesson;
