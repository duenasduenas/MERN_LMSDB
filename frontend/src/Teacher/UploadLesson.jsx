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
    <div>


      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Lesson title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) => setFiles(e.target.files)}
          required
        />

        <button type="submit" disabled={updating}>
          {updating ? "Uploading..." : "Upload Lesson"}
        </button>
      </form>

      <Link to={`/subject-teacher/${id}`}> return to subject </Link>

      {subject.lesson.map((lesson) => (
  <div key={lesson._id} style={{ marginBottom: "10px" }}>
    <h4>{lesson.title}</h4>

    <p>Status: {lesson.summaryStatus}</p>

    <DeleteLesson
      subjectId={subject._id}
      lessonId={lesson._id}
      onDeleted={(deletedId) => {
        setSubject(prev => ({
          ...prev,
          lesson: prev.lesson.filter(l => l._id !== deletedId)
            }));
          }}
        />
      </div>
    ))}

    </div>
  );
};

export default UploadLesson;
