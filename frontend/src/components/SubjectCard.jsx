import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { PenSquareIcon } from "lucide-react";
import { useEffect, useState } from "react";
import removeStudent from "./RemoveStudent.jsx";
import handleRemoveLocal from "./HandleRemoveLocal.jsx";

function SubjectCard() {
  const { id } = useParams();
  const [subject, setSubject] = useState({ student: [] });

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5001/api/subject/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubject(res.data.subject);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchSubject();
  }, [id]);

  if (!subject) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <Link to="/teacher/dashboard" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
        <Link
          to={`/subject-teacher/${subject._id}`}
          className="text-blue-500 hover:text-blue-700"
        >
          <PenSquareIcon size={20} />
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">{subject.subject}</h2>
        <p className="text-gray-700 mb-4">Code: {subject.code}</p>

        <div className="border p-4 rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Enrolled Students</h3>
          {subject.student && subject.student.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {subject.student.map((stud) => (
                <li key={stud._id}>
                  {stud.name} 
                  <button onClick={() => removeStudent(stud._id, handleRemoveLocal)}> Remove </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No students enrolled.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubjectCard;
