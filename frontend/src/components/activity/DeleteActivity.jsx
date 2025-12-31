import axios from "axios";
import { TrashIcon } from "lucide-react";
import { useNavigate } from "react-router";


function DeleteActivity({ activityId, onDeleted }) {
  const token = localStorage.getItem("token");  
  const navigate = useNavigate();
  const handleDelete = async () => {
    if (!activityId) {
      console.error("activityId is missing");
      return;
    }

    if (!confirm("Are you sure you want to delete this activity?")) {
        return;
    }

    try {  
      await axios.delete(
        `http://localhost:5001/api/teacher/${activityId}/delete-activity`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      
      onDeleted?.(activityId);
      navigate(-1);
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 text-sm font-medium"
    >
      <TrashIcon/>
    </button>
  );
}

export default DeleteActivity;
