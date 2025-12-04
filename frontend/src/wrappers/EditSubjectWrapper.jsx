import { useParams } from "react-router-dom";

function EditSubjectWrapper() {
  const { id } = useParams(); // get :id from URL
  return <EditSubject subjectId={id} />;
}

export default EditSubjectWrapper