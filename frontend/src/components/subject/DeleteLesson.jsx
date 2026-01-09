import axios from "axios";
import { useNavigate } from "react-router";

const DeleteLesson = ({ subjectId, lessonId, onDeleted }) => {
  const navigate = useNavigate()   
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5001/api/subject/${subjectId}/delete-lesson/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 Notify parent component
      if (onDeleted) onDeleted(lessonId);
      navigate(-1)

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to delete lesson");
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{
        background: "red",
        color: "white",
        padding: "6px 12px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Delete Lesson
    </button>
  );
};

export default DeleteLesson;
