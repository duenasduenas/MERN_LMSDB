// pages/GoogleAuthHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleAuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // Optionally decode role from JWT or store it in localStorage
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("role", payload.role);

      // Redirect based on role
      switch (payload.role) {
        case "student":
          navigate("/student/dashboard");
          break;
        case "teacher":
          navigate("/teacher/dashboard");
          break;
        case "admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      alert("Google login failed");
      navigate("/login");
    }
  }, [navigate]);

  return <p>Logging in with Google...</p>;
}

export default GoogleAuthHandler;
