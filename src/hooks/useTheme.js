
// Export your THEME_OPTIONS array here with gradient themes
export const THEME_OPTIONS = [
  {
    name: "Classic Light",
    bg: "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100",
    darkBg: "bg-gray-900", // Proper dark gray, not pure black
    chat: "bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200/50",
    darkChat: "bg-gray-800 text-gray-100 border border-gray-700",
    nav: "bg-white text-gray-900 border-gray-200",
    darkNav: "bg-gray-900 text-white border-gray-700",
    footer: "bg-gray-900 text-white",
    motion: "motion-blue",
    glow: "glow-blue",
  },
  {
    name: "Ocean Breeze",
    bg: "bg-gradient-to-br from-cyan-100 via-blue-200 to-teal-300",
    darkBg: "bg-slate-900",
    chat: "bg-white/80 backdrop-blur-md text-blue-900 border border-blue-200/50",
    darkChat: "bg-slate-800 text-slate-100 border border-slate-600",
    nav: "bg-white text-gray-900 border-gray-200",
    darkNav: "bg-slate-900 text-white border-slate-700",
    footer: "bg-slate-900 text-white",
    motion: "motion-blue",
    glow: "glow-blue",
  },
  {
    name: "Sunset Glow",
    bg: "bg-gradient-to-br from-orange-200 via-pink-200 to-red-300",
    darkBg: "bg-zinc-900",
    chat: "bg-white/80 backdrop-blur-md text-orange-900 border border-orange-200/50",
    darkChat: "bg-zinc-800 text-zinc-100 border border-zinc-600",
    nav: "bg-white text-gray-900 border-gray-200",
    darkNav: "bg-zinc-900 text-white border-zinc-700",
    footer: "bg-zinc-900 text-white",
    motion: "motion-peach",
    glow: "glow-peach",
  },
  {
    name: "Forest Dream",
    bg: "bg-gradient-to-br from-green-200 via-emerald-200 to-teal-300",
    darkBg: "bg-gray-900",
    chat: "bg-white/80 backdrop-blur-md text-green-900 border border-green-200/50",
    darkChat: "bg-gray-800 text-gray-100 border border-gray-600",
    nav: "bg-white text-gray-900 border-gray-200",
    darkNav: "bg-gray-900 text-white border-gray-700",
    footer: "bg-gray-900 text-white",
    motion: "motion-green",
    glow: "glow-green",
  },
  {
    name: "Purple Haze",
    bg: "bg-gradient-to-br from-purple-200 via-violet-200 to-indigo-300",
    darkBg: "bg-slate-900",
    chat: "bg-white/80 backdrop-blur-md text-purple-900 border border-purple-200/50",
    darkChat: "bg-slate-800 text-slate-100 border border-slate-600",
    nav: "bg-white text-gray-900 border-gray-200",
    darkNav: "bg-slate-900 text-white border-slate-700",
    footer: "bg-slate-900 text-white",
    motion: "motion-purple",
    glow: "glow-purple",
  },
  {
    name: "Aurora",
    bg: "bg-gradient-to-br from-pink-200 via-purple-200 to-cyan-200",
    darkBg: "bg-neutral-900",
    chat: "bg-white/80 backdrop-blur-md text-slate-900 border border-purple-200/50",
    darkChat: "bg-neutral-800 text-neutral-100 border border-neutral-600",
    nav: "bg-white text-gray-900 border-gray-200",
    darkNav: "bg-neutral-900 text-white border-neutral-700",
    footer: "bg-neutral-900 text-white",
    motion: "motion-mint",
    glow: "glow-mint",
  },
];

export function getSavedThemeIdx(uid) {
  return parseInt(localStorage.getItem(`theme_idx_${uid}`) || "0", 10);
}
export function setSavedThemeIdx(uid, idx) {
  localStorage.setItem(`theme_idx_${uid}`, idx);
}
export function getBoughtThemes(uid) {
  return JSON.parse(localStorage.getItem(`themes_bought_${uid}`) || '[0]');
}
export function setBoughtThemes(uid, arr) {
  localStorage.setItem(`themes_bought_${uid}`, JSON.stringify(arr));
}