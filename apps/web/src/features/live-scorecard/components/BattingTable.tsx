import React from 'react';

interface BatterStat {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  dismissal?: string;
  isStriker?: boolean;
  isNonStriker?: boolean;
}

interface BattingTableProps {
  batters: BatterStat[];
}

export const BattingTable: React.FC<BattingTableProps> = ({ batters }) => {
  if (!batters || batters.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-500">
        No Batting Data Available
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm">Batting</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900 text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-3 font-bold">Batter</th>
              <th className="px-4 py-3 text-right">R</th>
              <th className="px-4 py-3 text-right">B</th>
              <th className="px-4 py-3 text-right">4s</th>
              <th className="px-4 py-3 text-right">6s</th>
              <th className="px-4 py-3 text-right">SR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {batters.map((batter) => {
              const sr = batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(2) : '0.00';
              const isCurrentlyBatting = batter.isStriker || batter.isNonStriker;
              
              return (
                <tr 
                  key={batter.id} 
                  className={`group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    isCurrentlyBatting ? 'bg-brand-green/5 dark:bg-brand-green/5' : ''
                  }`}
                >
                  <td className="px-6 py-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isCurrentlyBatting ? 'text-brand-dark dark:text-brand-green' : 'text-slate-900 dark:text-white'}`}>
                        {batter.name}
                      </span>
                      {batter.isStriker && <span className="text-[10px] text-brand-dark dark:text-brand-green font-bold">🏏</span>}
                    </div>
                    {batter.dismissal ? (
                      <span className="text-[10px] font-medium text-slate-400 mt-0.5 truncate max-w-[200px]">
                        {batter.dismissal}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-brand-dark/50 dark:text-brand-green mt-0.5">
                        not out
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right font-black text-slate-900 dark:text-white">{batter.runs}</td>
                  <td className="px-4 py-4 text-right font-medium text-slate-500">{batter.balls}</td>
                  <td className="px-4 py-4 text-right font-medium text-slate-500">{batter.fours}</td>
                  <td className="px-4 py-4 text-right font-medium text-slate-500">{batter.sixes}</td>
                  <td className="px-4 py-4 text-right font-medium text-slate-500">{sr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
