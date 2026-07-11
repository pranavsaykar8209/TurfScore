import React from 'react';

interface MatchStatusCardProps {
  totalRuns: number;
  totalWickets: number;
  currentOverNumber: number;
  currentBallNumber: number;
  runRate: string;
  isSecondInnings: boolean;
  target?: number;
  runsNeeded?: number;
  ballsRemaining?: number;
  requiredRunRate?: string;
}

export const MatchStatusCard: React.FC<MatchStatusCardProps> = ({
  totalRuns,
  totalWickets,
  currentOverNumber,
  currentBallNumber,
  runRate,
  isSecondInnings,
  runsNeeded,
  ballsRemaining,
  requiredRunRate,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-brand-green/20 dark:border-brand-green/10 rounded-[1.5rem] p-4 md:p-5 shadow-sm relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-green/20 dark:bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <span className="text-[9px] font-bold uppercase tracking-widest text-brand-dark/50 dark:text-brand-green mb-1 block">
            Current Score
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
              {totalRuns}
            </span>
            <span className="text-xl font-bold text-slate-400">/ {totalWickets}</span>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8 flex-1">
          <div className="flex flex-col flex-1 min-w-[80px]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Overs</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{currentOverNumber}.{currentBallNumber}</span>
          </div>
          
          <div className="flex flex-col flex-1 min-w-[80px]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Run Rate</span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">{runRate}</span>
          </div>
        </div>

        {isSecondInnings && runsNeeded !== undefined && ballsRemaining !== undefined && requiredRunRate !== undefined && (
          <>
            <div className="hidden md:block w-px h-16 bg-slate-200 dark:bg-slate-800 shrink-0"></div>
            <div className="w-full h-px md:hidden bg-slate-200 dark:bg-slate-800 shrink-0 my-2"></div>
            
            <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8 flex-1">
              <div className="flex flex-col flex-1 min-w-[80px]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Req Runs</span>
                <span className="text-xl font-bold text-brand-dark dark:text-brand-green">{runsNeeded}</span>
              </div>
              <div className="flex flex-col flex-1 min-w-[80px]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Balls Left</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">{ballsRemaining}</span>
              </div>
              <div className="flex flex-col flex-1 min-w-[80px]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Req RR</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">{requiredRunRate}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
