import { MatchState } from '../types';

interface CurrentOverTrackerProps {
  matchState: MatchState;
}

export default function CurrentOverTracker({ matchState }: CurrentOverTrackerProps) {
  const { currentOverDeliveries, currentBall, currentBowler, bowlerStats } = matchState;

  const stats = currentBowler?.id ? bowlerStats[currentBowler.id] : { runs: 0, balls: 0, wickets: 0 };
  const oversBowled = Math.floor((stats?.balls || 0) / 6);
  const ballsBowled = (stats?.balls || 0) % 6;
  const oversDecimal = `${oversBowled}.${ballsBowled}`;

  // Render a placeholder ball if less than 6 legal balls thrown
  const placeholders = Array.from({ length: Math.max(0, 6 - currentBall) });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-6 h-full min-w-0 overflow-hidden">
      
      {/* Current Bowler */}
      <div className="flex-1 flex flex-col justify-between">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Current Bowler</h3>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-red-400">🥎</span>
          <span className="font-semibold text-slate-900 dark:text-white capitalize text-lg">
            {currentBowler?.name || 'Select Bowler'}
          </span>
        </div>
        <div className="flex gap-4 text-sm font-medium mt-auto">
          <div className="flex flex-col">
            <span className="text-slate-500 text-[10px] uppercase">Overs</span>
            <span className="text-slate-900 dark:text-white leading-none">{oversDecimal}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 text-[10px] uppercase">Runs</span>
            <span className="text-slate-900 dark:text-white leading-none">{stats?.runs || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 text-[10px] uppercase">Wck</span>
            <span className="text-brand-green leading-none">{stats?.wickets || 0}</span>
          </div>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="hidden md:block w-px bg-slate-200 dark:bg-slate-800"></div>
      
      {/* Horizontal Divider (Mobile) */}
      <div className="md:hidden h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

      {/* Current Over */}
      <div className="flex-[2] flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Current Over</h3>
          <span className="text-xs font-medium text-slate-500">{currentBall} Balls</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-auto">
          {currentOverDeliveries.map((delivery) => {
            let bgClass = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
            let display = delivery.runs.toString();

            if (delivery.isWicket || delivery.type === 'WICKET') {
              bgClass = "bg-red-500 text-white";
              if (delivery.type === 'WIDE' || delivery.type === 'NO_BALL') {
                display = `W+${delivery.type === 'WIDE' ? 'WD' : 'NB'}`;
              } else {
                display = 'W';
              }
              if (delivery.runs > 0) {
                display += `+${delivery.runs}`;
              }
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

            const textClass = display.length > 2 ? "text-sm" : "text-lg";

            return (
              <div 
                key={delivery.id} 
                className={`min-w-[3rem] h-12 px-2 shrink-0 rounded-full flex items-center justify-center font-bold ${textClass} ${bgClass} transition-all`}
              >
                {display}
              </div>
            );
          })}

          {/* Placeholders */}
          {placeholders.map((_, i) => (
            <div 
              key={`placeholder-${i}`} 
              className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 font-bold"
            >
              -
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
