import React, { useEffect } from "react";
import { useParams } from "react-router";

export function ViewLesson(){

    useEffect(() => {
    const fetchSubject = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5001/api/subject/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubject(res.data.subject);
        setEditForm({
          subject: res.data.subject.subject,
          code: res.data.subject.code,
        });
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert("Failed to fetch subject");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
        
    }, [id]);


  
}