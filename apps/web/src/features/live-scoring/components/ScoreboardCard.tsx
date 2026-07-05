import { MatchState } from '../types';

interface ScoreboardCardProps {
  battingTeamName: string;
  bowlingTeamName: string;
  matchState: MatchState;
  totalOvers: number;
}

export default function ScoreboardCard({ battingTeamName, bowlingTeamName, matchState, totalOvers }: ScoreboardCardProps) {
  const { totalRuns, totalWickets, currentOver, currentBall, target } = matchState;

  // Calculate overs decimal (e.g. 16 overs and 2 balls = 16.2)
  const oversDecimal = `${currentOver}.${currentBall}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 dark:bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden md:flex relative z-10 flex-row items-center justify-between gap-8">
        
        {/* Teams & VS */}
        <div className="flex items-center gap-12 w-auto justify-start">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Batting</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white capitalize truncate max-w-[200px] text-center">
              {battingTeamName}
            </span>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-slate-500">VS</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Bowling</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white capitalize truncate max-w-[200px] text-center">
              {bowlingTeamName}
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-24 bg-slate-200 dark:bg-slate-800"></div>

        {/* Score & Overs */}
        <div className="flex items-center gap-12 w-auto justify-end">
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-bold text-slate-900 dark:text-white leading-none tracking-tighter">
                {totalRuns}
              </span>
              <span className="text-5xl font-bold text-slate-400 leading-none">
                / {totalWickets}
              </span>
            </div>
            <div className="mt-2 text-base font-medium text-slate-500 uppercase tracking-wider flex items-center gap-3">
              <span><span className="text-slate-900 dark:text-white font-bold">{oversDecimal}</span> / {totalOvers} Overs</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Extras: <span className="text-slate-900 dark:text-white font-bold">{matchState.extraRuns || 0}</span></span>
              {matchState.isFreeHit && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-800">
                    FREE HIT
                  </span>
                </>
              )}
            </div>
          </div>

          {target && (
            <div className="flex flex-col items-start bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Target</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{target}</span>
              <div className="mt-1 flex items-center text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md">
                Need {Math.max(0, target - totalRuns)} runs in {Math.max(0, (totalOvers * 6) - (currentOver * 6 + currentBall))} balls
              </div>
            </div>
          )}
        </div>

      </div>

      {/* --- MOBILE LAYOUT --- */}
      <div className="md:hidden relative z-10 flex flex-col">
        <div className="grid grid-cols-3 gap-2 items-center">
          {/* Col 1: Team A */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white capitalize truncate w-full text-center">{battingTeamName}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">BAT</span>
          </div>

          {/* Col 2: Score & Overs */}
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900 dark:text-white leading-none tracking-tighter">{totalRuns}</span>
              <span className="text-2xl font-bold text-slate-400 leading-none">/ {totalWickets}</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-slate-500 uppercase text-center">
              <span>{oversDecimal} Overs</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Extras: {matchState.extraRuns || 0}</span>
            </div>
          </div>

          {/* Col 3: Team B */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white capitalize truncate w-full text-center">{bowlingTeamName}</span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">BOWL</span>
          </div>
        </div>
        
        {matchState.isFreeHit && (
          <div className="mt-2 flex justify-center">
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-200 dark:border-amber-800">
              FREE HIT
            </span>
          </div>
        )}

        {target && (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs">
            <span className="font-bold text-slate-900 dark:text-white">Target: {target}</span>
            <span className="font-bold text-brand-primary">Need {Math.max(0, target - totalRuns)} in {Math.max(0, (totalOvers * 6) - (currentOver * 6 + currentBall))}</span>
          </div>
        )}
      </div>
    </div>
  );
}
