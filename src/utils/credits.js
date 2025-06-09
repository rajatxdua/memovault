// src/utils/credits.js
// Centralized credits helpers for all components

export function getCredits(uid) {
  return parseInt(localStorage.getItem(`credits_${uid}`) || "0", 10);
}
export function setCredits(uid, value) {
  localStorage.setItem(`credits_${uid}`, value);
}
export function addCredits(uid, value) {
  setCredits(uid, getCredits(uid) + value);
}
export const deductCredits = (userId, amount) => {
  const currentCredits = getCredits(userId);
  const newCredits = Math.max(0, currentCredits - amount);
  localStorage.setItem(`credits_${userId}`, newCredits.toString());
  return newCredits;
};
export function redeemCode(uid, code) {
  // Map of valid codes and their credit values
  const codes = {
    "A#7f$Lp@9X": 100,
    "z%2&Kq!T8v": 200,
    "*M9@aL3#Xe": 500,
    "P$k7^dR1!q": 1000,
    "y@X8#Vm$4J": 10000,
  };
  const usedKey = `used_codes_${uid}`;
  const used = JSON.parse(localStorage.getItem(usedKey) || "[]");
  if (!codes[code] || used.includes(code)) return false;
  addCredits(uid, codes[code]);
  used.push(code);
  localStorage.setItem(usedKey, JSON.stringify(used));
  return codes[code];
}

// Daily chat limit functions
export const getDailyChats = (uid) => {
  try {
    const today = new Date().toDateString();
    const dailyData = localStorage.getItem(`daily_chats_${uid}`);
    
    if (!dailyData) {
      return { count: 0, date: today };
    }
    
    const parsed = JSON.parse(dailyData);
    
    // Reset if it's a new day
    if (parsed.date !== today) {
      return { count: 0, date: today };
    }
    
    return parsed;
  } catch (error) {
    console.error("Error getting daily chats:", error);
    return { count: 0, date: new Date().toDateString() };
  }
};

export const incrementDailyChats = (uid) => {
  try {
    const dailyData = getDailyChats(uid);
    const newCount = dailyData.count + 1;
    const today = new Date().toDateString();
    
    const updatedData = {
      count: newCount,
      date: today
    };
    
    localStorage.setItem(`daily_chats_${uid}`, JSON.stringify(updatedData));
    return newCount;
  } catch (error) {
    console.error("Error incrementing daily chats:", error);
    return 0;
  }
};

export const getRemainingFreeChats = (uid) => {
  const dailyData = getDailyChats(uid);
  const remaining = Math.max(0, 100 - dailyData.count);
  return remaining;
};

export const shouldChargeCredits = (uid) => {
  const dailyData = getDailyChats(uid);
  return dailyData.count >= 100;
};

export const resetDailyChats = (uid) => {
  try {
    localStorage.removeItem(`daily_chats_${uid}`);
    return true;
  } catch (error) {
    console.error("Error resetting daily chats:", error);
    return false;
  }
};
