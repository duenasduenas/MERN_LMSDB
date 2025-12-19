import { useState } from "react";
function handleRemoveLocal({id}) {
  const [localSubject, setLocalSubject] = useState(subject);

  setLocalSubject(prev => ({
    ...prev,
    students: prev.students.filter(s => s._id !== id)
  }));
}

export default handleRemoveLocal