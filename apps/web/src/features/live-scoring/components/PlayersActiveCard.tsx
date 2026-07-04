import { MatchState } from '../types';

interface PlayersActiveCardProps {
  matchState: MatchState;
  highlightStrikeChange?: boolean;
}

export default function PlayersActiveCard({ matchState, highlightStrikeChange }: PlayersActiveCardProps) {
  const { striker, nonStriker, batterStats } = matchState;

  const strikerStats = striker?.id ? batterStats[striker.id] : { runs: 0, balls: 0 };
  const nonStrikerStats = nonStriker?.id ? batterStats[nonStriker.id] : { runs: 0, balls: 0 };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-6 h-full">
      
      {/* Batters */}
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Batters</h3>
        
        <div className="flex flex-col gap-3">
          {/* Striker */}
          <div className={`relative flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border shadow-sm transition-all ${highlightStrikeChange ? 'border-brand-green ring-2 ring-brand-green ring-offset-1 dark:ring-offset-slate-900' : 'border-slate-200 dark:border-slate-700'}`}>
            <div className="flex items-center gap-3">
              <span className="text-brand-green">🏏</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white capitalize">
                    {striker?.name || 'Select Striker'}
                  </span>

                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-900 dark:text-white">{strikerStats?.runs || 0}</span>
              <span className="text-xs text-slate-500 ml-1">({strikerStats?.balls || 0})</span>
            </div>
            {highlightStrikeChange && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-green text-brand-dark text-xs font-bold py-2 px-4 rounded-lg whitespace-nowrap shadow-xl animate-in slide-in-from-bottom-2 fade-in duration-200 pointer-events-none z-10 flex flex-col items-center">
                Did the batters cross? Check strike.
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent border-t-[6px] border-t-brand-green" />
              </div>
            )}
          </div>

          {/* Non-Striker */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-transparent">
            <div className="flex items-center gap-3">
              <span className="opacity-0">🏏</span>
              <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                {nonStriker?.name || 'Select Non-Striker'}
              </span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-700 dark:text-slate-300">{nonStrikerStats?.runs || 0}</span>
              <span className="text-xs text-slate-500 ml-1">({nonStrikerStats?.balls || 0})</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
