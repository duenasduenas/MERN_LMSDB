import { useState } from "react";
import { useNavigate } from "react-router";


function CreateActivity(){
    const [activity, setActivity] = useState("");

    const navigate = useNavigate();

    const API_URL = "http://localhost:5001/api/teacher";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!teacherId) {
            setMessage('Teacher ID is Missing')
            return
        }

        try{
            const res = await fetch(`${API_URL}/${subjectId}/create-activity`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({activity})
            });

            const data = await res.json();
            setMessage(data.message);
        }
    }
}