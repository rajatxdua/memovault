// Fetch user memory history (last N)
export async function fetchUserHistory(uid, limit = 10) {
  const memories = JSON.parse(localStorage.getItem("memories")) || {};
  const userMemories = memories[uid] || [];
  userMemories.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return userMemories.slice(-limit).map((mem) => mem.text);
}

// Fetch user's positive memories
export async function fetchPositiveMemories(uid) {
  const memories = JSON.parse(localStorage.getItem("memories")) || {};
  const userMemories = memories[uid] || [];
  return userMemories
    .filter(
      (mem) =>
        (mem.feeling && mem.feeling.toLowerCase().includes("positive")) ||
        (mem.aiResult && mem.aiResult.toLowerCase().includes("positive"))
    )
    .map((mem) => mem.text);
}

// Dummy calendar event creator (replace with real logic if needed)
export async function createCalendarEvent({ summary, description, startDateTime, endDateTime }) {
  // You can integrate with Google Calendar API here if you want
  console.log("Calendar event created:", { summary, description, startDateTime, endDateTime });
}