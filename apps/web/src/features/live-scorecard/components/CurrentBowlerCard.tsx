import React from 'react';

interface Bowler {
  id: string;
  name: string;
  overs: string;
  runs: number;
  wickets: number;
  economy: string;
}

interface CurrentBowlerCardProps {
  bowler: Bowler | null;
}

export const CurrentBowlerCard: React.FC<CurrentBowlerCardProps> = ({ bowler }) => {
  if (!bowler) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-3 md:p-4 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Bowler</span>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <span className="text-xs">⚾</span>
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
            {bowler.name}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 border border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Overs</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{bowler.overs}</span>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 border border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Runs</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{bowler.runs}</span>
          </div>
          
          <div className="bg-brand-green/10 dark:bg-brand-green/5 rounded-lg p-2 border border-brand-green/20 dark:border-brand-green/10 flex flex-col items-center">
            <span className="text-[8px] font-bold uppercase tracking-widest text-brand-dark/50 dark:text-brand-green mb-0.5">W</span>
            <span className="text-sm font-black text-brand-dark dark:text-brand-green">{bowler.wickets}</span>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 border border-slate-100 dark:border-slate-800 flex flex-col items-center">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Econ</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">{bowler.economy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
