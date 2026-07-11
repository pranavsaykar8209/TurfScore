import React from 'react';

interface InningsTabsProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  showSecondInnings: boolean;
}

export const InningsTabs: React.FC<InningsTabsProps> = ({ activeTab, onTabChange, showSecondInnings }) => {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl w-full max-w-sm mx-auto mb-8 border border-slate-200 dark:border-slate-800">
      <button
        onClick={() => onTabChange(1)}
        className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
          activeTab === 1
            ? 'bg-white dark:bg-slate-800 text-brand-dark dark:text-brand-green shadow-sm'
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
      >
        First Innings
      </button>
      
      {showSecondInnings && (
        <button
          onClick={() => onTabChange(2)}
          className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
            activeTab === 2
              ? 'bg-white dark:bg-slate-800 text-brand-dark dark:text-brand-green shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Second Innings
        </button>
      )}
    </div>
  );
};
