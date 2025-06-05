import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../firebase";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userObj = {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      if (onLogin) onLogin(userObj);
      navigate("/");
    } catch (err) {
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-teal-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
          Welcome to MemoVault
        </h2>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
        >
          <span>Sign in with Google</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 48 48"
            className="fill-current"
          >
            <g>
              <path
                fill="#4285F4"
                d="M43.611 20.083H42V20H24v8h11.284C34.406 32.042 29.741 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.938 0 5.625 1.047 7.749 2.771l6.531-6.531C34.109 4.671 29.313 3 24 3 12.954 3 4 11.954 4 23s8.954 20 20 20c11.046 0 19.875-8.954 19.875-20 0-1.34-.138-2.646-.389-3.917z"
              />
              <path
                fill="#34A853"
                d="M6.306 14.691l6.571 4.819C14.656 16.099 19.001 13 24 13c2.938 0 5.625 1.047 7.749 2.771l6.531-6.531C34.109 4.671 29.313 3 24 3 16.318 3 9.432 7.961 6.306 14.691z"
              />
              <path
                fill="#FBBC05"
                d="M24 43c5.522 0 10.572-1.885 14.573-5.122l-6.787-5.582C29.714 33.974 26.954 35 24 35c-5.713 0-10.372-2.944-12.26-7.019l-6.573 5.081C9.411 40.048 16.318 43 24 43z"
              />
              <path
                fill="#EA4335"
                d="M43.611 20.083H42V20H24v8h11.284C34.406 32.042 29.741 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c2.938 0 5.625 1.047 7.749 2.771l6.531-6.531C34.109 4.671 29.313 3 24 3 16.318 3 9.432 7.961 6.306 14.691z"
              />
            </g>
          </svg>
        </button>
        {error && (
          <div className="text-red-500 text-sm mt-4 text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
