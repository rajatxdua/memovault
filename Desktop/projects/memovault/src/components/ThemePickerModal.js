import React from "react";

export default function ThemePickerModal({
  user,
  showThemes,
  THEME_OPTIONS,
  themeIdx,
  boughtThemes,
  handleThemeBuy,
  handleThemeChange,
  setShowThemes,
  darkMode
}) {
  console.log("ThemePickerModal render:", { user: !!user, showThemes, THEME_OPTIONS: !!THEME_OPTIONS });
  
  if (!user || !showThemes) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg w-full flex flex-col items-center max-h-[90vh] overflow-y-auto transition-colors ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-indigo-600 dark:text-indigo-300">
          Choose a Theme
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
          {THEME_OPTIONS.map((theme, idx) => (
            <div key={theme.name} className="flex flex-col items-center space-y-2">
              <div 
                className={`w-full aspect-[4/3] rounded-lg sm:rounded-xl mb-2 border-2 overflow-hidden relative transition-all duration-300 cursor-pointer ${
                  themeIdx === idx 
                    ? 'border-indigo-500 ring-2 ring-indigo-300 scale-105' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                }`}
                onClick={() => boughtThemes.includes(idx) && handleThemeChange(idx)}
              >
                <div className={`absolute inset-0 ${theme.bg}`}></div>
                <div className={`absolute left-1/2 bottom-2 -translate-x-1/2 w-16 sm:w-20 h-6 sm:h-8 rounded-xl flex items-center justify-center text-xs font-semibold shadow-lg z-10 ${
                  darkMode ? 'bg-gray-800/80 text-white' : 'bg-white/80 text-gray-900'
                }`}>
                  <span>Chat</span>
                </div>
              </div>
              
              <span className="text-xs sm:text-sm font-semibold text-center text-gray-700 dark:text-gray-300 px-1">
                {theme.name}
              </span>
              
              {boughtThemes.includes(idx) ? (
                <button 
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-bold transition-all w-full ${
                    themeIdx === idx 
                      ? 'bg-indigo-500 text-white cursor-default' 
                      : 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-700 cursor-pointer'
                  }`} 
                  onClick={() => handleThemeChange(idx)} 
                  disabled={themeIdx === idx}
                >
                  {themeIdx === idx ? 'Active ✓' : 'Use Theme'}
                </button>
              ) : (
                <button 
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-bold bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-all w-full cursor-pointer" 
                  onClick={() => {
                    console.log("Buying theme:", idx);
                    handleThemeBuy(idx);
                  }}
                >
                  Buy 200💎
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button 
          className="text-gray-500 dark:text-gray-400 text-sm sm:text-base underline hover:text-gray-700 dark:hover:text-gray-200 transition-colors px-4 py-2 rounded-lg" 
          onClick={() => {
            console.log("Closing themes modal...");
            setShowThemes(false);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}