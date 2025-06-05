import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SavedMemories() {
  const [memoriesList, setMemoriesList] = useState([]);
  const [user, setUser] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
    if (!currentUser) navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const storedMemories = JSON.parse(localStorage.getItem("memories")) || {};
    const userMemories = storedMemories[user.uid] || [];
    // Filter out AI chat conversations
    const filteredList = userMemories.filter(item => !item.isAIChat && !item.conversation);
    setMemoriesList(filteredList.map((item, idx) => ({ ...item, id: idx })));
  }, [user]);

  // Delete memory function
  const deleteMemory = (id) => {
    if (!user) return;
    const storedMemories = JSON.parse(localStorage.getItem("memories")) || {};
    let userMemories = storedMemories[user.uid] || [];
    userMemories = userMemories.filter((_, idx) => idx !== id);
    storedMemories[user.uid] = userMemories;
    localStorage.setItem("memories", JSON.stringify(storedMemories));
    setMemoriesList(userMemories.map((item, idx) => ({ ...item, id: idx })));
  };

  // Start editing a memory
  const startEdit = (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  // Save edited memory
  const saveEdit = (id) => {
    if (!user) return;
    const storedMemories = JSON.parse(localStorage.getItem("memories")) || {};
    let userMemories = storedMemories[user.uid] || [];
    userMemories = userMemories.map((item, idx) => idx === id ? { ...item, text: editText } : item);
    storedMemories[user.uid] = userMemories;
    localStorage.setItem("memories", JSON.stringify(storedMemories));
    setMemoriesList(userMemories.map((item, idx) => ({ ...item, id: idx })));
    setEditId(null);
    setEditText("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e0f7fa] to-[#a7ffeb] dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white bg-opacity-80 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10 backdrop-blur">
        <h1
          className="text-xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          ← MemoVault
        </h1>
        <span className="text-sm text-gray-700">Saved Memories</span>
      </nav>

      {/* LISTING */}
      <main className="flex-grow px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-6">
          {memoriesList.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              No saved memories.
            </p>
          ) : (
            memoriesList.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white bg-opacity-90 rounded-xl shadow-sm border border-gray-200 space-y-2"
              >
                {editId === item.id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      rows={4}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-800 whitespace-pre-wrap">{item.text}</p>
                    {item.type && (
                      <p className="text-sm text-indigo-600">
                        <strong>Type:</strong> {item.type}
                      </p>
                    )}
                    {item.feeling && (
                      <p className="text-sm text-teal-600">
                        <strong>Feeling:</strong> {item.feeling}
                      </p>
                    )}
                    {item.location && (
                      <p className="text-sm text-purple-600">
                        <strong>Location:</strong> {item.location}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => startEdit(item.id, item.text)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMemory(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
