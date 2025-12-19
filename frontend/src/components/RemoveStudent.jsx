import axios from "axios";
import handleRemoveLocal from "./HandleRemoveLocal";

export default async function removeStudent(studentId, subjectId, onSuccess) {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.delete(
      "http://localhost:5001/api/teacher/student/unenroll",
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { studentId, subjectId }, // IMPORTANT
      }
    );

    console.log("Server response:", res.data);


    handleRemoveLocal(studentId);
    alert("Student removed successfully!");
    
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.message || "There is an error here but still works tho :)");
    window.location.href = '/teacher/dashboard'
  }
}
