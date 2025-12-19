import axios from "axios";

import { MonitorOff } from "lucide-react";

function ToggleEnrollement({ subjectId }) {
    const hanleToggle = async () => {
        if (!window.confirm("Disable Enrollment?")) return;

        const token = localStorage.getItem('token')

        if(!token) {
            alert("Unauthorization")
            return
        }

        try{
            await axios.put(
                "http://localhost:5001/api/subject/toggle-enroll",
                {subjectId}
            );

            alert("Disable Successfully")
            window.location.href = '/teacher/dashboard'
        } catch (err) {
            console.error("ERROR:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Error unenrolling");
        }
    }

    return (
        <button onClick={hanleToggle} className="text-orange-300 hover:text-orange-500">
            <MonitorOff size={20} />
        </button>
    )
}

export default ToggleEnrollement