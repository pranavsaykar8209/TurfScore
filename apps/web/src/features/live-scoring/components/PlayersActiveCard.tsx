import { MatchState } from '../types';

interface PlayersActiveCardProps {
  matchState: MatchState;
}

export default function PlayersActiveCard({ matchState }: PlayersActiveCardProps) {
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
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
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
