function handleRemoveLocal(id) {
  setSubject(prev => ({
    ...prev,
    students: prev.students.filter(s => s._id !== id)
  }));
}

export default handleRemoveLocal