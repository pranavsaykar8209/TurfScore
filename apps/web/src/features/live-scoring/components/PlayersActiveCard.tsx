import { MatchState } from '../types';

interface PlayersActiveCardProps {
  matchState: MatchState;
  highlightStrikeChange?: boolean;
}

export default function PlayersActiveCard({ matchState, highlightStrikeChange }: PlayersActiveCardProps) {
  const { striker, nonStriker, batterStats, currentBowler, bowlerStats, currentOverDeliveries, currentBall } = matchState;

  const bStats = currentBowler?.id ? bowlerStats[currentBowler.id] : { runs: 0, balls: 0, wickets: 0 };
  const oversBowled = Math.floor((bStats?.balls || 0) / 6);
  const ballsBowled = (bStats?.balls || 0) % 6;
  const oversDecimal = `${oversBowled}.${ballsBowled}`;

  const placeholders = Array.from({ length: Math.max(0, 6 - (currentBall || 0)) });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-col gap-4 md:gap-6 h-full">
      
      {/* Mobile Layout: Batters and Bowler side-by-side */}
      <div className="md:hidden grid grid-cols-12 gap-2">
        {/* Batters */}
        <div className="col-span-4 flex flex-col gap-2">
          <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Batters</h3>
          <div className="flex flex-col gap-2">
            {[striker, nonStriker]
              .filter((b) => b !== null)
              .sort((a, b) => (a!.id > b!.id ? 1 : -1))
              .map((batter) => {
                const isStriker = batter!.id === striker?.id;
                const stats = batterStats[batter!.id] || { runs: 0, balls: 0 };
                
                return (
                  <div key={batter!.id} className={`relative flex items-center justify-between p-2 rounded-xl transition-all ${isStriker ? `bg-slate-100 dark:bg-slate-800 border ${highlightStrikeChange ? 'border-brand-green ring-1 ring-brand-green' : 'border-slate-200 dark:border-slate-700'}` : 'border border-transparent'}`}>
                    <div className="flex items-center overflow-hidden">
                      <span className={`capitalize truncate text-xs ${isStriker ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                        {batter!.name.split(' ')[0]}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`font-bold text-xs ${isStriker ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>{stats.runs}</span>
                      <span className="text-[10px] text-slate-500 ml-0.5">({stats.balls})</span>
                    </div>
                    {isStriker && highlightStrikeChange && (
                      <div className="absolute -top-12 left-0 bg-brand-green text-brand-dark text-xs font-bold py-2 px-4 rounded-lg whitespace-nowrap shadow-xl animate-in slide-in-from-bottom-2 fade-in duration-200 pointer-events-none z-50 flex flex-col items-center">
                        Did the batters cross? Check striker.
                        <div className="absolute -bottom-1.5 left-6 border-x-[6px] border-x-transparent border-t-[6px] border-t-brand-green" />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Bowler + Current Over */}
        <div className="col-span-8 flex flex-col border-l border-slate-200 dark:border-slate-800 pl-3">
          
          {/* Bowler Section */}
          <div className="flex flex-col mb-4">
            <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Bowler</h3>
            <div className="flex items-center justify-between gap-1 px-1">
              <span className="font-semibold text-slate-900 dark:text-white capitalize text-xs truncate">
                {(currentBowler?.name || 'Select').split(' ')[0]}
              </span>
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                {oversDecimal} - {bStats?.runs || 0} - {bStats?.wickets || 0}
              </span>
            </div>
          </div>

          {/* Current Over Section */}
          <div className="flex flex-col mt-auto">
            <div className="flex items-center justify-between mb-2 pr-2">
              <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Current Over</h3>
              <span className="text-[10px] font-medium text-slate-500">{currentBall || 0} Balls</span>
            </div>
            
            <div className="grid grid-cols-6 gap-1 w-full max-w-[240px]">
              {currentOverDeliveries?.map((delivery) => {
                let bgClass = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
                let display = delivery.runs.toString();

                if (delivery.isWicket || delivery.type === 'WICKET') {
                  bgClass = "bg-red-500 text-white";
                  if (delivery.type === 'WIDE' || delivery.type === 'NO_BALL') {
                    display = `W+${delivery.type === 'WIDE' ? 'WD' : 'NB'}`;
                  } else {
                    display = 'W';
                  }
                  if (delivery.runs > 0) display += `+${delivery.runs}`;
                } else if (delivery.type === 'WIDE') {
                  display = `${delivery.runs > 0 ? delivery.runs + '+' : ''}WD`;
                } else if (delivery.type === 'NO_BALL') {
                  display = `${delivery.runs > 0 ? delivery.runs + '+' : ''}NB`;
                } else if (delivery.isBoundary && delivery.runs === 4) {
                  bgClass = "bg-brand-green text-brand-dark";
                } else if (delivery.isBoundary && delivery.runs === 6) {
                  bgClass = "bg-brand-green text-brand-dark";
                } else if (delivery.runs === 0) {
                  display = '•';
                }

                const textClass = display.length > 2 ? "text-[8px]" : "text-xs";

                return (
                  <div 
                    key={delivery.id} 
                    className={`w-full aspect-square rounded-full flex items-center justify-center font-bold ${textClass} ${bgClass}`}
                  >
                    {display}
                  </div>
                );
              })}

              {/* Placeholders */}
              {placeholders.map((_, i) => (
                <div 
                  key={`placeholder-${i}`} 
                  className="w-full aspect-square rounded-full flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 text-slate-300 dark:text-slate-700 font-bold text-xs"
                >
                  -
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Desktop Layout: Only Batters */}
      <div className="hidden md:flex flex-1 flex-col gap-4">
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
                      Did the batters cross? Check striker.
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
