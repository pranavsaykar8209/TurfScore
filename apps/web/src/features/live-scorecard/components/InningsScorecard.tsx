import React from 'react';

interface InningsScorecardProps {
  battingTeam: string;
  bowlingTeam: string;
  batters: any[];
  bowlers: any[];
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    total: number;
  };
  fallOfWickets: any[];
}

export const InningsScorecard: React.FC<InningsScorecardProps> = ({
  battingTeam,
  bowlingTeam,
  batters,
  bowlers,
  extras,
  fallOfWickets
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm w-full overflow-hidden flex flex-col xl:flex-row gap-8 transition-colors">
      
      {/* Left: Batting */}
      <div className="flex-[3] flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Batting</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{battingTeam}</span>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-2 py-3 font-medium">Batter</th>
                <th className="px-2 py-3 font-medium"></th>
                <th className="px-2 py-3 font-medium text-right">R</th>
                <th className="px-2 py-3 font-medium text-right">B</th>
                <th className="px-2 py-3 font-medium text-right">4s</th>
                <th className="px-2 py-3 font-medium text-right">6s</th>
                <th className="px-2 py-3 font-medium text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {batters.map((batter, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white capitalize">{batter.name}</span>
                      {batter.isStriker && <span className="text-sm">🏏</span>}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-xs max-w-[120px] truncate">
                    {batter.outDesc ? (
                      <span className="text-slate-500">{batter.outDesc}</span>
                    ) : (
                      <span className="text-green-600 dark:text-brand-green font-medium">not out</span>
                    )}
                  </td>
                  <td className="px-2 py-3 text-right font-black text-slate-900 dark:text-white">{batter.runs}</td>
                  <td className="px-2 py-3 text-right text-slate-500 dark:text-slate-400 font-medium">{batter.balls}</td>
                  <td className="px-2 py-3 text-right text-slate-500 dark:text-slate-400">{batter.fours}</td>
                  <td className="px-2 py-3 text-right text-slate-500 dark:text-slate-400">{batter.sixes}</td>
                  <td className="px-2 py-3 text-right text-slate-500 dark:text-slate-400">
                    {batter.balls > 0 ? ((batter.runs / batter.balls) * 100).toFixed(1) : '0.0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Extras & FOW */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span className="font-bold text-slate-600 dark:text-slate-300">Extras: </span>
            <span className="text-slate-900 dark:text-white font-black">{extras.total}</span>
            <span className="ml-2">(W {extras.wides}, NB {extras.noBalls}, B {extras.byes}, LB {extras.legByes})</span>
          </div>
          {fallOfWickets.length > 0 && (
            <div className="truncate max-w-full">
              <span className="font-bold text-slate-600 dark:text-slate-300">FOW: </span>
              {fallOfWickets.map((fow, idx) => (
                <span key={idx} className="mr-2">
                  <span className="text-slate-900 dark:text-white font-bold">{fow.score}/{fow.wicketNumber}</span> 
                  <span className="ml-1 capitalize">({fow.batterName}, {fow.over}.{fow.ball})</span>
                  {idx < fallOfWickets.length - 1 && ','}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="hidden xl:block w-px bg-slate-200 dark:bg-slate-800"></div>
      <div className="xl:hidden h-px bg-slate-200 dark:bg-slate-800 w-full my-4"></div>

      {/* Right: Bowling */}
      <div className="flex-[2] flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Bowling</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{bowlingTeam}</span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-2 py-3 font-medium">Bowler</th>
                <th className="px-2 py-3 font-medium text-right">O</th>
                <th className="px-2 py-3 font-medium text-right">M</th>
                <th className="px-2 py-3 font-medium text-right">R</th>
                <th className="px-2 py-3 font-medium text-right">W</th>
                <th className="px-2 py-3 font-medium text-right">Econ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {bowlers.map((bowler, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white capitalize">{bowler.name}</span>
                      {bowler.isCurrent && <span className="text-sm">🥎</span>}
                    </div>
                  </td>
                  <td className="px-2 py-3 text-right text-slate-500 dark:text-slate-400 font-medium">{bowler.overs}</td>
                  <td className="px-2 py-3 text-right text-slate-500 dark:text-slate-400">{bowler.maidens}</td>
                  <td className="px-2 py-3 text-right font-black text-slate-900 dark:text-white">{bowler.runs}</td>
                  <td className="px-2 py-3 text-right font-black text-green-600 dark:text-brand-green">{bowler.wickets}</td>
                  <td className="px-2 py-3 text-right text-slate-500 dark:text-slate-400">{bowler.economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
