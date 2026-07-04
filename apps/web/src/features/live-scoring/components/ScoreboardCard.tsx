import { MatchState } from '../types';

interface ScoreboardCardProps {
  battingTeamName: string;
  bowlingTeamName: string;
  matchState: MatchState;
}

export default function ScoreboardCard({ battingTeamName, bowlingTeamName, matchState }: ScoreboardCardProps) {
  const { totalRuns, totalWickets, currentOver, currentBall, target } = matchState;

  // Calculate overs decimal (e.g. 16 overs and 2 balls = 16.2)
  const oversDecimal = `${currentOver}.${currentBall}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 dark:bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Teams & VS */}
        <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto justify-between md:justify-start">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Batting</span>
            <span className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white capitalize truncate max-w-[150px] md:max-w-[200px] text-center">
              {battingTeamName}
            </span>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-slate-500">VS</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Bowling</span>
            <span className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white capitalize truncate max-w-[150px] md:max-w-[200px] text-center">
              {bowlingTeamName}
            </span>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block w-px h-24 bg-slate-200 dark:bg-slate-800"></div>

        {/* Score & Overs */}
        <div className="flex items-center gap-8 md:gap-12 w-full md:w-auto justify-between md:justify-end">
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-none tracking-tighter">
                {totalRuns}
              </span>
              <span className="text-3xl md:text-5xl font-bold text-slate-400 leading-none">
                / {totalWickets}
              </span>
            </div>
            <div className="mt-2 text-sm md:text-base font-medium text-slate-500 uppercase tracking-wider flex items-center gap-3">
              <span><span className="text-slate-900 dark:text-white font-bold">{oversDecimal}</span> Overs</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>Extras: <span className="text-slate-900 dark:text-white font-bold">{matchState.extraRuns || 0}</span></span>
            </div>
          </div>

          {target && (
            <div className="flex flex-col items-center md:items-start bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Target</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{target}</span>
              <div className="mt-1 flex items-center gap-2 text-xs font-medium">
                <span className="text-slate-500">Req:</span>
                <span className="text-brand-primary">{target - totalRuns}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
