import React from 'react';

interface MatchHeaderCardProps {
  battingTeam: string;
  bowlingTeam: string;
  totalRuns: number;
  totalWickets: number;
  currentOverNumber: number;
  currentBallNumber: number;
  totalOvers: number;
  extras: number;
  target?: number;
  runsNeeded?: number;
  ballsRemaining?: number;
  isSecondInnings: boolean;
}

export const MatchHeaderCard: React.FC<MatchHeaderCardProps> = ({
  battingTeam,
  bowlingTeam,
  totalRuns,
  totalWickets,
  currentOverNumber,
  currentBallNumber,
  totalOvers,
  extras,
  target,
  runsNeeded,
  ballsRemaining,
  isSecondInnings,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center shadow-sm dark:shadow-lg w-full mb-4 transition-colors">
      {/* Left Side: Teams */}
      <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-start">
        <div className="flex flex-col">
          <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
            Batting
          </span>
          <span className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white truncate max-w-[120px] md:max-w-[200px]">
            {battingTeam}
          </span>
        </div>
        
        <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">
          VS
        </div>

        <div className="flex flex-col text-right md:text-left">
          <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
            Bowling
          </span>
          <span className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white truncate max-w-[120px] md:max-w-[200px]">
            {bowlingTeam}
          </span>
        </div>
      </div>

      {/* Divider for mobile */}
      <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-4 md:hidden"></div>
      {/* Divider for desktop */}
      <div className="hidden md:block w-px h-20 bg-slate-200 dark:bg-slate-800 mx-8"></div>

      {/* Right Side: Score */}
      <div className="flex flex-col items-end w-full md:w-auto">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
            {totalRuns}
          </span>
          <span className="text-3xl md:text-5xl font-bold text-slate-500 dark:text-slate-400 leading-none">
            / {totalWickets}
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-2">
          <span>
            <span className="text-slate-900 dark:text-white">{currentOverNumber}.{currentBallNumber}</span> / {totalOvers} OVERS
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span>
            EXTRAS: <span className="text-slate-900 dark:text-white">{extras}</span>
          </span>
        </div>

        {isSecondInnings && target !== undefined && runsNeeded !== undefined && ballsRemaining !== undefined && (
          <div className="mt-3 bg-green-100 dark:bg-brand-green/10 text-green-700 dark:text-brand-green px-3 py-1 rounded-lg text-xs font-bold w-full text-center md:text-right md:w-auto">
            Target {target} • Need {runsNeeded} runs from {ballsRemaining} balls
          </div>
        )}
      </div>
    </div>
  );
};
