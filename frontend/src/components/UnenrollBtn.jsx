import axios from "axios";
import { Trash2Icon } from "lucide-react";

function UnenrollBtn({ code }) {
  const handleUnenroll = async () => {
    if (!window.confirm("Unenroll from this subject?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to unenroll");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5001/api/student/unenroll",
        { code },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      alert("Unenrolled successfully");
      window.location.href = "/student/dashboard";
    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error unenrolling");
    }
  };

  return (
    <button onClick={handleUnenroll} className="text-red-500 hover:text-red-700">
      <Trash2Icon size={20} />
    </button>
  );
}

export default UnenrollBtn;
