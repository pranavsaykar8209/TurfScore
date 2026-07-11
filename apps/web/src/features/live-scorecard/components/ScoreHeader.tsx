import React from 'react';

interface ScoreHeaderProps {
  sessionName: string;
  teamA: string;
  teamB: string;
  totalRuns: number;
  totalWickets: number;
  currentOverNumber: number;
  currentBallNumber: number;
  runRate: string;
  target?: number;
  runsNeeded?: number;
  ballsRemaining?: number;
  requiredRunRate?: string;
  isLive: boolean;
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  sessionName,
  teamA,
  teamB,
  totalRuns,
  totalWickets,
  target,
  runsNeeded,
  ballsRemaining,
  requiredRunRate,
  isLive,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full mb-2">
      {/* Session Name & Live Badge */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
          {sessionName}
        </span>
        {isLive && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 border border-red-100 dark:border-red-900/50 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-[9px] font-extrabold tracking-widest uppercase">Live</span>
          </div>
        )}
      </div>

      {/* Teams */}
      <h2 className="text-lg md:text-xl font-bold text-slate-700 dark:text-slate-300 mb-2 truncate max-w-full">
        {teamA} <span className="text-slate-400 mx-2 text-xs font-normal">vs</span> {teamB}
      </h2>

      {/* Score */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
          {totalRuns}
        </span>
        <span className="text-3xl md:text-4xl font-black text-slate-400 dark:text-slate-500 leading-none">
          / {totalWickets}
        </span>
      </div>

      {/* Target Info (Second Innings) */}
      {target !== undefined && runsNeeded !== undefined && ballsRemaining !== undefined && requiredRunRate !== undefined && (
        <div className="mt-1 flex flex-col items-center">
          <div className="bg-brand-green/10 dark:bg-brand-green/5 text-brand-dark dark:text-brand-green px-3 py-1 rounded-lg font-bold text-sm md:text-base mb-1">
            Need {runsNeeded} runs from {ballsRemaining} balls
          </div>
        </div>
      )}
    </div>
  );
};
