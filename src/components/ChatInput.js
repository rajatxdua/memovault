import React from "react";

export default function ChatInput({
  input,
  setInput,
  handleInputKeyDown,
  sendMessage,
  loading,
  aiTyping,
  listening,
  startListening,
  darkMode,
}) {
  return (
    <div className="flex flex-col space-y-3">
      {/* Input container */}
      <div className={`flex items-end space-x-2 p-3 rounded-lg border transition-colors ${
        darkMode 
          ? 'bg-gray-800/50 border-gray-600' 
          : 'bg-white/80 border-gray-300'
      }`}>
        {/* Text input */}
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Share your thoughts, memories, or ask me anything..."
          disabled={loading || aiTyping}
          className={`flex-1 resize-none rounded-lg px-4 py-3 text-base border-0 outline-none transition-colors ${
            darkMode
              ? 'bg-gray-700 text-white placeholder-gray-400'
              : 'bg-gray-50 text-gray-900 placeholder-gray-500'
          } disabled:opacity-50`}
          rows={3}
          style={{
            minHeight: '60px',
            maxHeight: '120px'
          }}
        />
        
        {/* Action buttons */}
        <div className="flex flex-col space-y-2">
          {/* Voice input button */}
          <button
            onClick={startListening}
            disabled={loading || aiTyping}
            className={`p-3 rounded-lg transition-all duration-200 ${
              listening
                ? 'bg-red-500 text-white animate-pulse'
                : darkMode
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={listening ? "Listening..." : "Voice input"}
          >
            {listening ? "🎤" : "🎙️"}
          </button>
          
          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading || aiTyping}
            className={`p-3 rounded-lg font-semibold transition-all duration-200 ${
              !input.trim() || loading || aiTyping
                ? darkMode
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
            title="Send message (Enter)"
          >
            {loading || aiTyping ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              "📤"
            )}
          </button>
        </div>
      </div>
      
      {/* Helper text */}
      <div className={`text-xs text-center ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <span>Press Enter to send • Shift+Enter for new line</span>
      </div>
    </div>
  );
}