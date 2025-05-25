
import React, { useEffect } from "react";

export default function ChatArea({ conversation, aiTyping, chatEndRef, darkMode }) {
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, aiTyping, chatEndRef]);

  return (
    <div 
      className={`flex-1 overflow-y-auto mb-4 rounded-lg p-4 transition-colors duration-300 ${
        darkMode ? 'bg-gray-900/50 border border-gray-700' : 'bg-gray-50/50 border border-gray-200'
      }`} 
      style={{ 
        minHeight: '400px',
        maxHeight: 'calc(100vh - 300px)',
      }}
    >
      {conversation.length === 0 && (
        <div className={`text-center mt-12 px-4 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="text-5xl mb-4">🧠</div>
          <p className="text-lg font-semibold mb-3">MemoVault AI is ready!</p>
          <p className="text-base mb-6">
            Share your memories, thoughts, or experiences. I'll help you explore and preserve them.
          </p>
          <div className="mt-6 text-sm opacity-75 space-y-2">
            <p>💡 <strong>Try asking:</strong></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
                "I had an amazing day today..."
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
                "Tell me about yourself"
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
                "Help me remember this moment"
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
                "What should I do about..."
              </div>
            </div>
          </div>
        </div>
      )}
      
      {conversation.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4 px-2`}
        >
          <div className={`flex items-start space-x-3 max-w-[90%] md:max-w-[80%] lg:max-w-[70%] ${
            msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
          }`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
              msg.sender === "user"
                ? darkMode
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-500 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-600"
            }`}>
              {msg.sender === "user" ? "👤" : "🧠"}
            </div>
            
            {/* Message bubble */}
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm border relative ${
                msg.sender === "user"
                  ? darkMode
                    ? "bg-indigo-600 text-white rounded-br-sm border-indigo-500"
                    : "bg-indigo-500 text-white rounded-br-sm border-indigo-400"
                  : darkMode
                    ? "bg-gray-700 text-gray-100 rounded-bl-sm border-gray-600"
                    : "bg-white text-gray-900 rounded-bl-sm border-gray-200"
              }`}
              style={{ wordBreak: "break-word" }}
            >
              {/* Message content with enhanced formatting */}
              <div className="whitespace-pre-wrap text-base leading-relaxed">
                {msg.text.split('\n').map((line, lineIdx) => {
                  // Check if line is a bullet point or numbered list (fixed escape character)
                  if (line.trim().match(/^[•\-*]\s/) || line.trim().match(/^\d+\.\s/)) {
                    return (
                      <div key={lineIdx} className="my-1 pl-3">
                        {line}
                      </div>
                    );
                  }
                  return (
                    <div key={lineIdx} className={lineIdx > 0 ? "mt-3" : ""}>
                      {line}
                    </div>
                  );
                })}
              </div>
              
              {/* Timestamp */}
              <div className={`text-xs mt-2 opacity-70 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {aiTyping && (
        <div className="flex justify-start mb-4 px-2">
          <div className="flex items-start space-x-3 max-w-[90%] md:max-w-[80%]">
            {/* AI Avatar */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
              darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
            }`}>
              🧠
            </div>
            
            {/* Typing indicator */}
            <div className={`px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 border-gray-600'
                : 'bg-white text-gray-500 border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-base">MemoVault AI is thinking...</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
}