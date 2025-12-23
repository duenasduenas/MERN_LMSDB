import { useState } from "react";
import StudentDashboard from "./Student/StudentDashboard";
import { Route, Routes, useParams  } from "react-router";
import "./App.css";
import EnrollPage from "./Student/EnrollPage";
import LogInPage from "./auth/LogInPage";
import RoleGuard from "./lib/roleguard";
import TeacherDashboard from "./Teacher/TeacherDashboard";
import HomePage from "./pages/HomePage";
import SubjectPage from "./Student/SubjectPage"
import SubjectCard from "./Teacher/SubjectCard";
import GoogleAuthHandler from "./pages/GoogleAuthHandler";
import EditSubject from "./components/EditSubject"; // import your component
import CreateSubjectWrapper from "./wrappers/CreateSubjectWrapper";
import TeacherSignup from "./Teacher/TeacherSignup";
import StudentSignup from "./Student/StudentSignup";
import SignupSelect from "./pages/SignUp";
import ActivityPage from "./components/activity/ActivityPage";

function App() {
  return (
    <>
      <Routes>
        {/* student route */}
        <Route
          path="/student/dashboard"
          element={
            <RoleGuard allowedRoles={"student"}>
              <StudentDashboard />
            </RoleGuard>
          }
        />

        {/* teacher route */}
        <Route
          path="/teacher/dashboard"
          element={
            <RoleGuard allowedRoles={"teacher"}>
              <TeacherDashboard />
            </RoleGuard>
          }
        />
        <Route path="/signup/teacher" element={<TeacherSignup />} />

        <Route
          path="/create-subject/:teacherId"
          element={
            <RoleGuard allowedRoles={"teacher"}>
              <CreateSubjectWrapper />
            </RoleGuard>
          }
        />
        <Route path="/signup/student" element={<StudentSignup />} />


        {/* Subject routes */}
        <Route path="/subject-student/:id" element={<SubjectPage />} />
        <Route path="/subject-teacher/:id" element={<SubjectCard />} />

        {/* Edit subject route */}
        <Route
          path="/edit-subject/:id"
          element={<EditSubjectWrapper />}
        />

        {/* Acivity Routes */}
        <Route path="/activity/:id" element={<ActivityPage />} />

        <Route path="/auth/google/callback" element={<GoogleAuthHandler />} />
        <Route path="/enroll" element={<EnrollPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupSelect />} />
      </Routes>
    </>
  );
}

// Wrapper to extract subjectId from URL and pass to EditSubject
function EditSubjectWrapper() {
  const { id } = useParams(); // get :id from URL
  return <EditSubject subjectId={id} />;
}



export default App;
