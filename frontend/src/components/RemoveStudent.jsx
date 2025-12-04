import axios from "axios";

async function removeStudent(studentId, onRemove) {
    try{
        const [subject, setSubject] = useState({ students: [] });
        const token = localStorage.getItem("token");

        const res = await axios.delete(
        "http://localhost:5001/api/teacher/students",
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
            data: { id: studentId }, // axios requires "data" for DELETE body
        }
        );

        if (onRemove) onRemove(studentId);

        console.log("Removed:", res.data);
        alert("Student Removed!");
    } catch (error){
        console.error(error.response?.data || error.message)
    }
}

export default removeStudent