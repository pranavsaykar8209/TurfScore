import React from 'react';

interface Delivery {
  id: string;
  runs: number;
  type: string;
  isBoundary: boolean;
  isWicket: boolean;
}

interface BowlerAndOverCardProps {
  bowler: {
    id: string;
    name: string;
    overs: string;
    runs: number;
    wickets: number;
    economy: string;
  } | null;
  deliveries: Delivery[];
}

export const BowlerAndOverCard: React.FC<BowlerAndOverCardProps> = ({ bowler, deliveries }) => {
  const getDeliveryDisplay = (d: Delivery) => {
    if (d.isWicket) {
      let display = 'W';
      if (d.type === 'WIDE') display = 'W+Wd';
      else if (d.type === 'NO_BALL') display = 'W+Nb';
      else if (d.type === 'BYE') display = `W+${d.runs}B`;
      else if (d.type === 'LEG_BYE') display = `W+${d.runs}Lb`;
      
      if (d.runs > 0 && d.type !== 'BYE' && d.type !== 'LEG_BYE') {
        display += `+${d.runs}`;
      }
      return display;
    }
    
    if (d.type === 'WIDE') return `${d.runs > 0 ? d.runs + '+' : ''}Wd`;
    if (d.type === 'NO_BALL') return `${d.runs > 0 ? d.runs + '+' : ''}Nb`;
    if (d.type === 'BYE') return `${d.runs}B`;
    if (d.type === 'LEG_BYE') return `${d.runs}Lb`;
    if (d.runs === 0) return '.';
    return d.runs.toString();
  };

  const getDeliveryColor = (d: Delivery) => {
    if (d.isWicket) return 'bg-red-500 text-white shadow-red-500/20';
    if (d.type === 'WIDE' || d.type === 'NO_BALL' || d.type === 'BYE' || d.type === 'LEG_BYE') {
      return 'bg-orange-500 text-white shadow-orange-500/20';
    }
    if (d.runs === 6) return 'bg-purple-500 text-white shadow-purple-500/30';
    if (d.runs === 4) return 'bg-blue-500 text-white shadow-blue-500/30';
    if (d.runs === 0) return 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400';
    return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  };

  if (!bowler) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col md:flex-row w-full shadow-sm h-full overflow-hidden transition-colors">
      {/* Left Side: Bowler */}
      <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-4 block">
          Current Bowler
        </span>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm">
            🥎
          </div>
          <span className="font-semibold text-lg text-slate-900 dark:text-white capitalize">
            {bowler.name}
          </span>
        </div>

        <div className="flex gap-4 text-sm font-medium mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Overs</span>
            <span className="leading-none text-slate-900 dark:text-white">{bowler.overs}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Runs</span>
            <span className="leading-none text-slate-900 dark:text-white">{bowler.runs}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Wck</span>
            <span className="text-green-600 dark:text-brand-green leading-none">{bowler.wickets}</span>
          </div>
        </div>
      </div>

      {/* Right Side: Current Over */}
      <div className="flex-[2] p-6 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Current Over
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {deliveries.length} Balls
          </span>
        </div>

        <div className="flex-1 flex flex-wrap items-end gap-2 mt-auto">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className={`min-w-[3rem] h-12 px-3 shrink-0 rounded-full flex items-center justify-center font-black text-xs md:text-sm shadow-sm transition-all ${getDeliveryColor(delivery)}`}
              >
                  {getDeliveryDisplay(delivery)}
                </div>
            ))}
            
            {Array.from({ length: Math.max(0, 6 - deliveries.length) }).map((_, idx) => (
                <div 
                  key={`empty-${idx}`} 
                  className="w-12 h-12 shrink-0 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-700 flex items-center justify-center font-bold"
                >
                  -
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
