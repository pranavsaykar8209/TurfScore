import React from 'react';

interface BowlerStat {
  id: string;
  name: string;
  overs: number;
  balls: number;
  runs: number;
  wickets: number;
  maidens: number;
  wides: number;
  noBalls: number;
  isCurrent?: boolean;
}

interface BowlingTableProps {
  bowlers: BowlerStat[];
}

export const BowlingTable: React.FC<BowlingTableProps> = ({ bowlers }) => {
  if (!bowlers || bowlers.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-500">
        No Bowling Data Available
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm">Bowling</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900 text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-3 font-bold">Bowler</th>
              <th className="px-4 py-3 text-right">O</th>
              <th className="px-4 py-3 text-right">M</th>
              <th className="px-4 py-3 text-right">R</th>
              <th className="px-4 py-3 text-right">W</th>
              <th className="px-4 py-3 text-right">ECON</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {bowlers.map((bowler) => {
              const totalBalls = (bowler.overs || 0) * 6 + (bowler.balls || 0);
              const oversDecimal = `${bowler.overs || 0}.${bowler.balls || 0}`;
              const econ = totalBalls > 0 ? ((bowler.runs / totalBalls) * 6).toFixed(2) : '0.00';
              
              return (
                <tr 
                  key={bowler.id} 
                  className={`group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    bowler.isCurrent ? 'bg-brand-green/5 dark:bg-brand-green/5' : ''
                  }`}
                >
                  <td className="px-6 py-4 flex items-center gap-2">
                    <span className={`font-bold ${bowler.isCurrent ? 'text-brand-dark dark:text-brand-green' : 'text-slate-900 dark:text-white'}`}>
                      {bowler.name}
                    </span>
                    {bowler.isCurrent && <span className="text-[10px] text-brand-dark dark:text-brand-green font-bold">⚾</span>}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-slate-500">{oversDecimal}</td>
                  <td className="px-4 py-4 text-right font-medium text-slate-500">{bowler.maidens || 0}</td>
                  <td className="px-4 py-4 text-right font-black text-slate-900 dark:text-white">{bowler.runs}</td>
                  <td className="px-4 py-4 text-right font-black text-brand-dark dark:text-brand-green">{bowler.wickets}</td>
                  <td className="px-4 py-4 text-right font-medium text-slate-500">{econ}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
