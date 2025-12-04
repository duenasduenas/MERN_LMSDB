import React from "react";
import { useParams } from "react-router-dom";
import CreateSubject from "../Teacher/CreateSubject";

const CreateSubjectWrapper = () => {
  const { teacherId } = useParams();
  return <CreateSubject teacherId={teacherId} />;
};

export default CreateSubjectWrapper;
