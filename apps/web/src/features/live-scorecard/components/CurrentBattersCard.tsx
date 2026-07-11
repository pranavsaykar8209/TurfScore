import React from 'react';

interface Batter {
  id: string;
  name: string;
  runs: number;
  balls: number;
  isStriker: boolean;
}

interface CurrentBattersCardProps {
  batters: Batter[];
}

export const CurrentBattersCard: React.FC<CurrentBattersCardProps> = ({ batters }) => {
  if (!batters || batters.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col h-full transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-500">Batters</span>
      </div>

      <div className="flex flex-col flex-1 justify-center gap-3">
        {batters.map((batter) => (
          <div key={batter.id} className="w-full">
            <div className={`flex items-center justify-between p-3 rounded-xl transition-all ${
              batter.isStriker ? 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm' : 'border border-transparent'
            }`}>
              <div className="flex items-center gap-3 overflow-hidden">
                <span className={batter.isStriker ? 'text-brand-green text-sm' : 'opacity-0 text-sm'}>🏏</span>
                
                <span className={`capitalize ${batter.isStriker ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-300'}`}>
                  {batter.name}
                </span>
              </div>

              <div className="text-right">
                <span className={`font-bold ${batter.isStriker ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-300'}`}>{batter.runs}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-1">({batter.balls})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
