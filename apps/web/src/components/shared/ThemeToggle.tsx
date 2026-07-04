import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Only show tooltip if it's currently light mode when landing on the page
    const hasSeenTooltip = localStorage.getItem('hasSeenDarkModeTooltip');
    if (theme === 'light' && !hasSeenTooltip) {
      setShowTooltip(true);
      localStorage.setItem('hasSeenDarkModeTooltip', 'true');
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={() => {
          toggleTheme();
          setShowTooltip(false);
        }}
        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
          <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap relative">
            Try Dark Mode! 🌙
            {/* Arrow pointing up */}
            <div className="absolute -top-1.5 right-3 border-x-4 border-x-transparent border-b-4 border-b-slate-900" />
          </div>
        </div>
      )}
    </div>
  );
};
