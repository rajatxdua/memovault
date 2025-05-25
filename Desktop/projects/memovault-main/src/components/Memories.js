import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Memories({ darkMode }) {
  const [user, setUser] = useState(null);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, chat, personal
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadMemories(currentUser.uid);
      } else {
        navigate("/"); // Redirect to home if not logged in
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadMemories = (uid) => {
    try {
      const savedMemories = localStorage.getItem(`memories_${uid}`);
      if (savedMemories) {
        const allMemories = JSON.parse(savedMemories);
        setMemories(allMemories);
      } else {
        setMemories([]);
      }
    } catch (error) {
      console.error("Error loading memories:", error);
      setMemories([]);
    }
  };

  const saveMemories = (newMemories) => {
    if (user) {
      localStorage.setItem(`memories_${user.uid}`, JSON.stringify(newMemories));
      setMemories(newMemories);
    }
  };

  const addMemory = () => {
    const title = prompt("Memory title:");
    const content = prompt("Memory content:");
    
    if (title && content) {
      const newMemory = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString().split('T')[0],
        category: "Personal",
        timestamp: new Date().toISOString(),
        isChat: false
      };
      
      const updatedMemories = [newMemory, ...memories];
      saveMemories(updatedMemories);
    }
  };

  const deleteMemory = (id) => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      const updatedMemories = memories.filter(memory => memory.id !== id);
      saveMemories(updatedMemories);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Work: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      Travel: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      Family: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
      Personal: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      Chat: "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100",
    };
    return colors[category] || colors.Personal;
  };

  // Filter memories based on selected filter
  const filteredMemories = memories.filter(memory => {
    if (filter === "all") return true;
    if (filter === "chat") return memory.isChat;
    if (filter === "personal") return !memory.isChat;
    return true;
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100'
    } py-6 px-4`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
            My Memories
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Your precious moments and AI conversations, preserved forever
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === "all"
                  ? "bg-indigo-500 text-white shadow-lg"
                  : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All ({memories.length})
            </button>
            <button
              onClick={() => setFilter("chat")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === "chat"
                  ? "bg-indigo-500 text-white shadow-lg"
                  : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              💬 AI Chats ({memories.filter(m => m.isChat).length})
            </button>
            <button
              onClick={() => setFilter("personal")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === "personal"
                  ? "bg-indigo-500 text-white shadow-lg"
                  : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              📝 Personal ({memories.filter(m => !m.isChat).length})
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button
              onClick={addMemory}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              ✨ Add New Memory
            </button>
            <button
              onClick={() => navigate("/")}
              className={`px-6 py-3 border-2 font-semibold rounded-lg transition-all duration-200 ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              🏠 Back to Chat
            </button>
          </div>
        </div>

        {/* Memories Grid */}
        {filteredMemories.length === 0 ? (
          <div className={`text-center py-12 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-2xl shadow-lg`}>
            <div className="text-6xl mb-4">
              {filter === "chat" ? "💬" : filter === "personal" ? "📝" : "📚"}
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {filter === "chat" 
                ? "No AI conversations yet" 
                : filter === "personal" 
                ? "No personal memories yet"
                : "No memories yet"
              }
            </h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              {filter === "chat" 
                ? "Start chatting with the AI to create your first conversation memory!"
                : "Create your first memory to preserve those special moments!"
              }
            </p>
            {filter !== "chat" && (
              <button
                onClick={addMemory}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Create First Memory
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                } ${memory.isChat ? 'ring-2 ring-indigo-500/20' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(memory.category)}`}>
                    {memory.isChat ? "💬 AI Chat" : memory.category}
                  </div>
                  <button
                    onClick={() => deleteMemory(memory.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
                    title="Delete memory"
                  >
                    🗑️
                  </button>
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {memory.title}
                </h3>
                
                <div className={`text-sm mb-4 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {memory.isChat ? (
                    <div className="space-y-2">
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg">
                        <span className="font-semibold text-indigo-700 dark:text-indigo-300">You:</span>
                        <p className="mt-1">{memory.userMessage}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded-lg">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">AI:</span>
                        <p className="mt-1 line-clamp-3">{memory.aiResponse}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="line-clamp-4">{memory.content}</p>
                  )}
                </div>
                
                <div className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                } flex items-center justify-between`}>
                  <div className="flex items-center">
                    <span className="mr-1">📅</span>
                    {new Date(memory.date).toLocaleDateString()}
                  </div>
                  {memory.timestamp && (
                    <div className="text-xs">
                      {new Date(memory.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}