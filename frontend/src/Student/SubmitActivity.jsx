import React, { useState } from "react";
import { Link } from "lucide-react";
import { useNavigate } from "react-router";

function SubmitActivty({ activityId, onSubmit }) {
    const [subject, setSubject] = useState(null)

    const navigate = useNavigate();
    // const token = localStorage.getItem("token")
    
    // const onSubmit = async () => {
    //     if(!activityId){
    //         console.error("Activity Id is missing")
    //     }

    //     if(!confirm("Submit Activity?")){
    //         return
    //     }


    // }

    return (
        <main>
            <div className="">
                <h1>Submit Acivity Page</h1>
            </div>

            <div>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                    Return to Page
                </button>
            </div>
        </main>
    )
}

export default SubmitActivty