import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ---------------------------
  // 1. Handle Email/Password Login
  // ---------------------------
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      // Correct backend route
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      redirectByRole(user.role);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // 2. Handle Google Login
  // ---------------------------
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  // ---------------------------
  // 3. Handle Google callback token
  // ---------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      // Decode JWT to get role
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("role", payload.role);

      redirectByRole(payload.role);
    }
  }, []);

  // ---------------------------
  // 4. Redirect user based on role
  // ---------------------------
  const redirectByRole = (role) => {
    switch (role) {
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
        alert("Unknown role");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-green-500 p-6 relative overflow-hidden">
      {/* Background elements for sports feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJzdHJpcGVzIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPgogICAgICA8cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSI0MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+CiAgICA8L3BhdHRlcm4+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSI0MCUiIGhlaWdodD0iNDAiIGZpbGw9InVybCgjc3RyaXBlcykiLz4KPC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800 drop-shadow-md">
          🏆 Log In to Play 🏆
        </h1>

        {/* Email/Password Inputs */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 px-4 py-3 border rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 px-4 py-3 border rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full px-6 py-3 bg-yellow-500 text-black font-bold text-lg rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 mb-4"
        >
          {loading ? "Logging in..." : "🚀 Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center w-full mb-4">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-gray-500">or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          🔴 Log in with Google
        </button>
      </div>
    </div>
  );
}

export default LogInPage;
