// components/GoogleLoginButton.jsx
import React from "react";

function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // Redirect user to your backend Google OAuth route
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      Log in with Google
    </button>
  );
}

export default GoogleLoginButton;
