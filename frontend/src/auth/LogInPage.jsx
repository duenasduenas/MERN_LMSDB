import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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
    window.location.href = "http://localhost:5173/api/auth/google";
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
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">

      {/* Logo / Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome Back
        </h1>
        <p className="text-gray-500 mt-1">Login to continue</p>
      </div>

      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Divider */}
      <div className="flex items-center my-6">
        <hr className="flex-1 border-gray-300" />
        <span className="px-3 text-gray-500 text-sm">OR</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Google Button */}
      <button
        onClick={handleGoogleLogin}
        className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          className="w-6 h-6"
          alt="Google"
        />
        <span className="text-gray-700 font-medium">Continue with Google</span>
      </button>

      {/* Back Link */}
      <div className="text-center mt-6">
        <Link
          to="/"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Home
        </Link>
      </div>

    </div>
  </div>
);

}

export default LogInPage;
