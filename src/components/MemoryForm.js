import React from "react";
import axios from "axios";
import { getCredits, deductCredits } from "../utils/credits";
import CreditsModal from "./CreditsModal";

export default function MemoryForm({
  user,
  memory,
  setMemory,
  type,
  setType,
  feeling,
  setFeeling,
  location,
  setLocation,
  onSave,
  onLogin,
}) {
  const [aiResult, setAIResult] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showCredits, setShowCredits] = React.useState(false);
  const [credits, setCreditsState] = React.useState(0);

  React.useEffect(() => {
    if (user?.uid) setCreditsState(getCredits(user.uid));
  }, [user]);

  const handleCreditsChange = (val) => setCreditsState(val);

  async function handleSaveMemory() {
    // Premium: Saving more than 500 memories costs 150 credits
    if (user) {
      const storedMemories = JSON.parse(localStorage.getItem("memories")) || {};
      const userMemories = storedMemories[user.uid] || [];
      if (userMemories.length >= 500) {
        if (getCredits(user.uid) < 150) {
          alert("Saving more than 500 memories requires 150 credits. Get more credits.");
          setShowCredits(true);
          return;
        }
        if (!deductCredits(user.uid, 150)) {
          alert("Failed to deduct credits.");
          return;
        }
        setCreditsState(getCredits(user.uid));
      }
    }
    setLoading(true);
    let aiResponse = "";
    try {
      // Call OpenAI API
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          model: "text-davinci-003",
          prompt: `Is this memory positive or negative? Memory: "${memory}"`,
          max_tokens: 10,
          temperature: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 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",
          },
        }
      );
      aiResponse = response.data.choices[0].text.trim();
      setAIResult(aiResponse);
    } catch (error) {
      setAIResult("AI error");
      aiResponse = "AI error";
    }
    // Save to Firebase, including AI result
    onSave(aiResponse);
    setLoading(false);
  }

  if (!user) {
    return (
      <button onClick={onLogin} className="mb-6 w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200">
        Sign in with Google
      </button>
    );
  }

  return (
    <>
      <div className="mb-4 text-sm text-gray-600 text-center">
        Welcome, <span className="font-semibold text-indigo-600">{user.displayName}</span>!
      </div>
      <textarea
        value={memory}
        onChange={(e) => setMemory(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSaveMemory();
          }
        }}
        placeholder="Write your memory here..."
        maxLength={300}
        className="w-full h-40 p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-200 shadow-sm resize-none bg-white bg-opacity-80 transition-all duration-200"
      />
      <div className="flex justify-between items-center mt-2 mb-2 text-xs text-gray-500">
        <span>{memory.length}/300</span>
        <span className={memory.trim() ? "text-teal-600" : "text-gray-400"}>
          {memory.trim() ? "Ready to save!" : "Start typing..."}
        </span>
        {user && (
          <>
            <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 rounded px-2 py-1">
              Credits: {credits}
            </span>
            <button className="ml-2 text-xs text-blue-600 underline" onClick={() => setShowCredits(true)}>
              Get Credits
            </button>
          </>
        )}
      </div>
      <button
        onClick={handleSaveMemory}
        disabled={loading}
        className="mt-4 w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-teal-400 hover:from-indigo-600 hover:to-teal-500 text-white py-2 rounded-xl font-semibold shadow-lg transform active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        {loading ? "Processing..." : "✨ Save Memory"}
      </button>
      {aiResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded-xl text-gray-700 text-sm shadow">
          <strong>AI Output:</strong> {aiResult}
        </div>
      )}
      <CreditsModal open={showCredits} onClose={() => setShowCredits(false)} user={user} onCreditsChange={handleCreditsChange} />
    </>
  );
}
