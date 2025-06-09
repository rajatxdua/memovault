// src/components/MobileMenu.js
import React from "react";

export default function MobileMenu({ onNavigate, onLogout, setShowMenu }) {
  return (
    <div className="sm:hidden bg-white bg-opacity-95 px-6 py-2 shadow-md flex flex-col space-y-2">
      <button
        onClick={() => {
          setShowMenu(false);
          onNavigate("/saved");
        }}
        className="text-sm text-blue-500 hover:underline text-left"
      >
        My Memories
      </button>
      <button
        onClick={() => {
          setShowMenu(false);
          onNavigate("/profile");
        }}
        className="text-sm text-purple-500 hover:underline text-left"
      >
        Profile
      </button>
      <button
        onClick={() => {
          setShowMenu(false);
          onLogout();
        }}
        className="text-sm text-red-500 hover:text-red-600 underline text-left"
      >
        Logout
      </button>
    </div>
  );
}
