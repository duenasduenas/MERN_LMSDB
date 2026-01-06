import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router";

const UploadLesson = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [updating, setUpdating] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", title);

      for (let file of files) {
        formData.append("files", file); // MUST match multer key
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

    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
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
  );
};

export default UploadLesson;
