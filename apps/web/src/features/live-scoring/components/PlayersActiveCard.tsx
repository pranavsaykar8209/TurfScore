import { MatchState } from '../types';

interface PlayersActiveCardProps {
  matchState: MatchState;
  highlightStrikeChange?: boolean;
}

export default function PlayersActiveCard({ matchState, highlightStrikeChange }: PlayersActiveCardProps) {
  const { striker, nonStriker, batterStats } = matchState;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-6 h-full">
      
      {/* Batters */}
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Batters</h3>
        
        <div className="flex flex-col gap-3">
          {[striker, nonStriker]
            .filter((b) => b !== null)
            .sort((a, b) => (a!.id > b!.id ? 1 : -1))
            .map((batter) => {
              const isStriker = batter!.id === striker?.id;
              const stats = batterStats[batter!.id] || { runs: 0, balls: 0 };
              
              return (
                <div key={batter!.id} className={`relative flex items-center justify-between p-3 rounded-xl transition-all ${isStriker ? `bg-slate-100 dark:bg-slate-800 border shadow-sm ${highlightStrikeChange ? 'border-brand-green ring-2 ring-brand-green ring-offset-1 dark:ring-offset-slate-900' : 'border-slate-200 dark:border-slate-700'}` : 'border border-transparent'}`}>
                  <div className="flex items-center gap-3">
                    <span className={isStriker ? 'text-brand-green' : 'opacity-0'}>🏏</span>
                    <span className={`capitalize ${isStriker ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                      {batter!.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${isStriker ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{stats.runs}</span>
                    <span className="text-xs text-slate-500 ml-1">({stats.balls})</span>
                  </div>
                  {isStriker && highlightStrikeChange && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-green text-brand-dark text-xs font-bold py-2 px-4 rounded-lg whitespace-nowrap shadow-xl animate-in slide-in-from-bottom-2 fade-in duration-200 pointer-events-none z-10 flex flex-col items-center">
                      Did the batters cross? Check strike.
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-x-[6px] border-x-transparent border-t-[6px] border-t-brand-green" />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

    </div>
  );
}
