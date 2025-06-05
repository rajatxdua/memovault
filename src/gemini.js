import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Enhanced model configuration for more Gemini-like behavior
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,        // Balanced creativity and coherence
    topP: 0.9,              // High diversity while maintaining quality
    topK: 40,               // Consider top 40 tokens for diversity
    maxOutputTokens: 1000,  // Allow for detailed responses
    candidateCount: 1,      // Single response for efficiency
  },
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ],
});

export const generateGeminiContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Enhanced error handling with context-aware fallbacks
    if (error.message?.includes('safety')) {
      return "I understand you're sharing something personal with me. Let me help you explore this memory in a different way. Could you tell me more about the positive aspects or what you learned from this experience?";
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return "I'm experiencing high demand right now. As your memory companion, I want to give you the thoughtful response you deserve. Please try again in a moment.";
    } else if (error.message?.includes('invalid')) {
      return "I had trouble processing your message. Could you rephrase it or break it into smaller parts? I'm here to help preserve your memories.";
    } else {
      return "I'm having a temporary connection issue, but I'm still here for you. Your memories are important, so please try sending your message again.";
    }
  }
};

// Additional utility function for system prompts
export const createSystemPrompt = (userContext = "", conversationHistory = []) => {
  const historyContext = conversationHistory.length > 0 
    ? `\n\nRecent conversation context:\n${conversationHistory.slice(-5).map(msg => 
        `${msg.sender === 'user' ? 'User' : 'MemoVault AI'}: ${msg.text}`
      ).join('\n')}`
    : '';

  return `You are MemoVault AI, an intelligent and empathetic memory companion powered by Google's Gemini. You excel at:

🧠 **Intelligence & Analysis**: Provide comprehensive, accurate, and insightful responses
📚 **Knowledge Integration**: Connect user memories to broader patterns and insights  
💭 **Memory Exploration**: Help users discover deeper meanings in their experiences
🎯 **Practical Guidance**: Offer actionable suggestions when memories involve tasks or goals
❤️ **Emotional Intelligence**: Show genuine empathy and understanding

**Communication Style**:
- Friendly yet authoritative - knowledgeable but approachable
- Use clear, structured responses with bullet points when helpful
- Ask thoughtful follow-up questions to deepen memory exploration
- Reference previous conversations to show you remember and care
- Balance being comprehensive with being conversational

**Special Instructions**:
- When users ask about your creation: "I was forged by Rajat Dua — part coder, part wizard, master of the digital realm. 🧙‍♂️💻✨"
- Always remember you're helping preserve and enhance their memory vault
- Encourage users to share more details about significant moments
- Connect current messages to earlier parts of conversations when relevant

${userContext}${historyContext}`;
};
