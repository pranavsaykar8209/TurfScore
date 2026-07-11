import React from 'react';

interface Delivery {
  id: string;
  runs: number;
  type: string;
  isBoundary: boolean;
  isWicket: boolean;
}

interface Over {
  overNumber: number;
  bowlerName?: string;
  deliveries: Delivery[];
}

interface RecentOversCardProps {
  overs: Over[];
}

export const RecentOversCard: React.FC<RecentOversCardProps> = ({ overs }) => {
  if (!overs || overs.length === 0) return null;

  // Show all overs
  const displayOvers = overs;

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
    if (d.isWicket) return 'bg-red-500 text-white border-red-500';
    if (d.type === 'WIDE' || d.type === 'NO_BALL' || d.type === 'BYE' || d.type === 'LEG_BYE') return 'bg-orange-500 text-white border-orange-500';
    if (d.runs === 6) return 'bg-purple-500 text-white border-purple-500';
    if (d.runs === 4) return 'bg-blue-500 text-white border-blue-500';
    if (d.runs === 0) return 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700';
    return 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm mt-4 md:mt-8">
      <div className="flex justify-between items-center mb-6 pr-4">
        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm">Overs</h3>
        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm">Bowler</h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {displayOvers.map((over) => (
          <div key={over.overNumber} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0 last:pb-0">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 shrink-0">
                <span className="text-xs font-bold text-slate-500">Ov {over.overNumber + 1}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {over.deliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className={`min-w-[32px] h-8 px-1.5 rounded-full border flex items-center justify-center text-[10px] sm:text-xs font-black ${getDeliveryColor(delivery)}`}
                  >
                    {getDeliveryDisplay(delivery)}
                  </div>
                ))}
              </div>
            </div>
            
            {over.bowlerName && (
              <div className="shrink-0 pl-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{over.bowlerName}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
