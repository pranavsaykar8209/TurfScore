import React from 'react';

interface Delivery {
  id: string;
  runs: number;
  type: string;
  isBoundary: boolean;
  isWicket: boolean;
}

interface CurrentOverCardProps {
  deliveries: Delivery[];
}

export const CurrentOverCard: React.FC<CurrentOverCardProps> = ({ deliveries }) => {
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
    if (d.isWicket) {
      return 'bg-red-500 text-white shadow-red-500/20'; // Wicket: Red
    }
    if (d.type === 'WIDE' || d.type === 'NO_BALL' || d.type === 'BYE' || d.type === 'LEG_BYE') {
      return 'bg-orange-500 text-white shadow-orange-500/20'; // Extras: Orange
    }
    if (d.runs === 6) {
      return 'bg-brand-primary text-white shadow-brand-primary/30'; // Six: Primary
    }
    if (d.runs === 4) {
      return 'bg-brand-green text-brand-dark shadow-brand-green/30'; // Four: Green
    }
    if (d.runs === 0) {
      return 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'; // Dot: Neutral
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'; // Normal run
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-3 md:p-4 shadow-sm flex flex-col h-full overflow-hidden relative">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Over</span>
      </div>

      <div className="flex-1 flex items-center">
        {deliveries && deliveries.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                className={`min-w-[28px] md:min-w-[32px] h-7 md:h-8 px-1.5 rounded-full flex items-center justify-center font-black text-[10px] md:text-xs shadow-sm ${getDeliveryColor(delivery)}`}
              >
                {getDeliveryDisplay(delivery)}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 md:gap-2 opacity-50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
