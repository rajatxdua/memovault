import React, { useState, useEffect, useRef } from "react";
import { auth, provider, signInWithPopup } from "./firebase";
import { generateGeminiContent } from "./gemini";
import MEMOVAULT_IDENTITY from "./config/identity";
import {
  THEME_OPTIONS,
  getSavedThemeIdx,
  setSavedThemeIdx,
  getBoughtThemes,
  setBoughtThemes,
} from "./hooks/useTheme";
import ThemePickerModal from "./components/ThemePickerModal";
import ChatArea from "./components/ChatArea";
import ChatInput from "./components/ChatInput";

export default function Home({ showThemes, setShowThemes, darkMode: appDarkMode, user: appUser }) {
  const [user, setUser] = useState(appUser);
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [listening, setListening] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);
  const [boughtThemes, setBoughtThemesState] = useState([0]);
  const [darkMode, setDarkMode] = useState(appDarkMode);

  const chatEndRef = useRef(null);

  // Update states when app-level props change
  useEffect(() => {
    setUser(appUser);
  }, [appUser]);

  useEffect(() => {
    setDarkMode(appDarkMode);
  }, [appDarkMode]);

  useEffect(() => {
    const storedUser = auth.currentUser || appUser;
    if (storedUser) {
      setUser(storedUser);
      setThemeIdx(getSavedThemeIdx(storedUser.uid) || 0);
      setBoughtThemesState(getBoughtThemes(storedUser.uid) || [0]);
      
      // Load previous conversation for this user
      loadUserConversation(storedUser.uid);
    }
  }, [appUser, appDarkMode]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setThemeIdx(getSavedThemeIdx(currentUser.uid) || 0);
        setBoughtThemesState(getBoughtThemes(currentUser.uid) || [0]);
        loadUserConversation(currentUser.uid);
      } else {
        setConversation([]); // Clear conversation when user logs out
      }
    });
    return () => unsubscribe();
  }, []);

  // Load user's conversation from localStorage
  const loadUserConversation = (uid) => {
    try {
      const savedConversation = localStorage.getItem(`conversation_${uid}`);
      if (savedConversation) {
        setConversation(JSON.parse(savedConversation));
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  // Save conversation to localStorage
  const saveConversation = (newConversation, uid) => {
    try {
      localStorage.setItem(`conversation_${uid}`, JSON.stringify(newConversation));
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  // Save chat conversation to memories
  const saveConversationToMemories = (userMessage, aiResponse, uid) => {
    try {
      // Get existing memories
      const savedMemories = localStorage.getItem(`memories_${uid}`);
      let memories = savedMemories ? JSON.parse(savedMemories) : [];

      // Create memory entry for this conversation
      const conversationMemory = {
        id: Date.now(),
        title: `💬 ${userMessage.substring(0, 50)}${userMessage.length > 50 ? '...' : ''}`,
        content: `You: "${userMessage}"\n\nMemoVault AI: "${aiResponse}"`,
        date: new Date().toISOString().split('T')[0],
        category: "Chat",
        timestamp: new Date().toISOString(),
        isChat: true, // Flag to identify chat memories
        userMessage,
        aiResponse
      };

      // Add to memories (at the beginning)
      memories.unshift(conversationMemory);
      
      // Keep only last 200 chat memories to avoid storage bloat
      const chatMemories = memories.filter(m => m.isChat);
      const otherMemories = memories.filter(m => !m.isChat);
      
      if (chatMemories.length > 200) {
        const recentChatMemories = chatMemories.slice(0, 200);
        memories = [...recentChatMemories, ...otherMemories];
      }

      // Save back to localStorage
      localStorage.setItem(`memories_${uid}`, JSON.stringify(memories));
      
    } catch (error) {
      console.error("Error saving conversation to memories:", error);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setThemeIdx(getSavedThemeIdx(result.user.uid) || 0);
      setBoughtThemesState(getBoughtThemes(result.user.uid) || [0]);
      loadUserConversation(result.user.uid);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeBuy = (idx) => {
    if (user && !boughtThemes.includes(idx)) {
      // This logic might need to be re-evaluated if credits were used for themes
      const updatedBoughtThemes = [...boughtThemes, idx];
      setBoughtThemesState(updatedBoughtThemes);
      setBoughtThemes(user.uid, updatedBoughtThemes);
    }
  };

  const handleThemeChange = (idx) => {
    setThemeIdx(idx);
    if (user) {
      setSavedThemeIdx(user.uid, idx);
    }
  };

  // Enhanced sendMessage function with free daily chat limit
  const sendMessage = async () => {
    if (!input.trim() || !user) return;
    
    const userMessage = input.trim();
    const newUserMessage = { 
      sender: "user", 
      text: userMessage, 
      timestamp: new Date().toISOString() 
    };
    
    // Add user message to conversation
    const updatedConversation = [...conversation, newUserMessage];
    setConversation(updatedConversation);
    setInput("");
    setAiTyping(true);

    // Save conversation to localStorage
    saveConversation(updatedConversation, user.uid);

    try {
      // Increment daily chat count and update remaining free chats
      // setFreeChatsRemaining(getRemainingFreeChats(user.uid)); // Removed

      // Create context-aware prompt with MemoVault identity
      const conversationContext = conversation
        .slice(-8) // Increased context for better memory
        .map(msg => `${msg.sender === 'user' ? 'User' : 'MemoVault AI'}: ${msg.text}`)
        .join('\n');

      // Enhanced AI prompt with MemoVault identity and Gemini-like behavior
      const aiPrompt = `${MEMOVAULT_IDENTITY}

CORE PERSONALITY TRAITS:
- Be helpful, knowledgeable, and comprehensive in your responses
- Maintain a friendly yet intelligent tone - approachable but authoritative
- Show genuine interest in the user's memories and experiences
- Provide structured, clear responses when appropriate
- Ask thoughtful follow-up questions to help users explore their memories deeper
- Be creative and insightful when analyzing memories or suggesting connections
- Remember context from the conversation and build upon it
- Be empathetic and understanding, especially with emotional memories
- Offer practical suggestions when memories involve tasks or plans

RESPONSE GUIDELINES:
- Keep responses conversational but informative (aim for 100-200 words)
- Use bullet points or numbered lists when organizing information
- Ask clarifying questions if something is unclear
- Provide specific, actionable suggestions when appropriate
- Acknowledge emotions and validate experiences
- Connect current messages to previous parts of the conversation when relevant
- If asked about your creation or development, use the specific response in your identity

CONVERSATION CONTEXT:
${conversationContext ? `Previous conversation:\n${conversationContext}\n` : 'This is the start of our conversation.'}

USER'S CURRENT MESSAGE: ${userMessage}

Respond as MemoVault AI, keeping in mind your role as both a memory companion and an intelligent assistant. Focus on helping the user preserve, understand, and act upon their memories while maintaining the conversational style of Gemini.`;

      // Get AI response from Gemini with enhanced configuration
      const aiResponse = await generateGeminiContent(aiPrompt);
      
      const newAIMessage = { 
        sender: "ai", 
        text: aiResponse, 
        timestamp: new Date().toISOString() 
      };
      
      const finalConversation = [...updatedConversation, newAIMessage];
      setConversation(finalConversation);
      
      // Save updated conversation
      saveConversation(finalConversation, user.uid);
      
      // Save this conversation to memories
      saveConversationToMemories(userMessage, aiResponse, user.uid);
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = { 
        sender: "ai", 
        text: "I'm experiencing some technical difficulties right now. As your memory companion, I want to ensure our conversation is preserved properly. Please try again in a moment - your memories are important to me!", 
        timestamp: new Date().toISOString() 
      };
      const errorConversation = [...updatedConversation, errorMessage];
      setConversation(errorConversation);
      saveConversation(errorConversation, user.uid);
    } finally {
      setAiTyping(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startListening = () => {
    setListening(true);
    setTimeout(() => setListening(false), 2000);
  };

  // Clear conversation function
  const clearConversation = () => {
    if (user && window.confirm("Are you sure you want to clear this conversation? Your memories will still be preserved in the memories section.")) {
      setConversation([]);
      localStorage.removeItem(`conversation_${user.uid}`);
    }
  };

  // Get current theme
  const currentTheme = THEME_OPTIONS[themeIdx] || THEME_OPTIONS[0];
  
  // Background classes - use theme-specific backgrounds
  const pageBackground = darkMode ? currentTheme.darkBg : currentTheme.bg;
  const cardBackground = darkMode ? currentTheme.darkChat : currentTheme.chat;
  
  // Add motion and glow classes
  const motionClass = currentTheme.motion || "";
  const glowClass = currentTheme.glow || "";

  return (
    <div className={`min-h-[calc(100vh-200px)] flex flex-col transition-all duration-500 ${pageBackground} ${motionClass}`}>
      {user && (
        <ThemePickerModal
          user={user}
          showThemes={showThemes}
          THEME_OPTIONS={THEME_OPTIONS}
          themeIdx={themeIdx}
          boughtThemes={boughtThemes}
          handleThemeBuy={handleThemeBuy}
          handleThemeChange={handleThemeChange}
          setShowThemes={setShowThemes}
          darkMode={darkMode}
        />
      )}
      
      <main className="flex-grow flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
        <div
          className={`
            relative w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl
            p-3 sm:p-4 md:p-6 lg:p-8
            rounded-xl sm:rounded-2xl lg:rounded-3xl
            transition-all duration-500 ease-in-out
            flex flex-col items-center
            ${cardBackground}
            ${glowClass}
            shadow-lg sm:shadow-xl lg:shadow-2xl
            hover:shadow-2xl lg:hover:shadow-3xl
            ${darkMode 
              ? 'hover:shadow-purple-500/20' 
              : 'hover:shadow-indigo-500/15'
            }
            transform hover:scale-[1.01] sm:hover:scale-[1.02]
            mx-2 sm:mx-4
          `}
        >
          {!user ? (
            <div className="flex flex-col items-center justify-center text-center w-full space-y-4 sm:space-y-6">
              {/* Welcome Section */}
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
                  Welcome to MemoVault
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-xs sm:max-w-sm md:max-w-md mx-auto leading-relaxed px-2">
                  Your AI-powered memory companion.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full max-w-xs sm:max-w-sm md:max-w-md text-xs sm:text-sm">
                {[
                  { icon: "🧠", text: "Gemini AI Chat" },
                  { icon: "💾", text: "Memory Vault" },
                  { icon: "🎨", text: "Custom Themes" }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-1 sm:space-x-2 p-2 sm:p-3 rounded-lg border transition-colors ${
                      darkMode 
                        ? 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50' 
                        : 'bg-gray-50/80 border-gray-200 hover:bg-gray-100/80'
                    }`}
                  >
                    <span className="text-sm sm:text-base md:text-lg">{feature.icon}</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Login Button */}
              <button
                className="
                  w-full sm:w-auto
                  px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4
                  rounded-lg sm:rounded-xl md:rounded-2xl
                  bg-gradient-to-r from-green-500 to-emerald-600
                  hover:from-green-600 hover:to-emerald-700
                  active:from-green-700 active:to-emerald-800
                  text-white font-semibold
                  text-sm sm:text-base md:text-lg
                  shadow-md sm:shadow-lg md:shadow-xl
                  hover:shadow-lg sm:hover:shadow-xl md:hover:shadow-2xl
                  transform hover:scale-[1.02] sm:hover:scale-105 active:scale-[0.98] sm:active:scale-95
                  transition-all duration-200
                  focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-green-400/50
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  flex items-center justify-center space-x-2
                  min-h-[44px] sm:min-h-[48px] md:min-h-[52px]
                "
                onClick={login}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Signing in...</span>
                    <span className="sm:hidden">Loading...</span>
                  </>
                ) : (
                  <>
                    <span className="text-base sm:text-lg">🚀</span>
                    <span className="hidden sm:inline">Sign in with Google</span>
                    <span className="sm:hidden">Sign In</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            // Much larger chat container
            <div className="w-full flex flex-col h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] xl:h-[80vh] min-h-[500px] max-h-[800px]">
              {/* Chat Header with Free Chats and Credits */}
              <div className={`flex justify-between items-center mb-3 p-3 rounded-lg ${
                darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🧠</span>
                  <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    MemoVault AI
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    Powered by Gemini
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearConversation}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      darkMode 
                        ? 'text-gray-400 hover:text-gray-200' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    title="Clear conversation"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <ChatArea
                conversation={conversation}
                aiTyping={aiTyping}
                chatEndRef={chatEndRef}
                darkMode={darkMode}
              />
              <ChatInput
                input={input}
                setInput={setInput}
                handleInputKeyDown={handleInputKeyDown}
                sendMessage={sendMessage}
                loading={loading}
                aiTyping={aiTyping}
                listening={listening}
                startListening={startListening}
                darkMode={darkMode}
              />
              {listening && (
                <div className="text-indigo-500 dark:text-indigo-400 text-xs sm:text-sm mt-2 ml-2 sm:ml-3 animate-pulse flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Listening...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
