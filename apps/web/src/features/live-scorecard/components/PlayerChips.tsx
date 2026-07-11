import React from 'react';

interface PlayerChipsProps {
  title: string;
  players: { id: string; name: string }[];
}

export const PlayerChips: React.FC<PlayerChipsProps> = ({ title, players }) => {
  if (!players || players.length === 0) return null;

  return (
    <div className="mt-6 mb-8 px-2">
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 ml-2">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {players.map((player) => (
          <div
            key={player.id} 
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 transition-colors"
          >
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
              <span className="text-[8px]">👤</span>
            </div>
            <span className="font-semibold text-sm text-slate-700 dark:text-slate-300 capitalize">{player.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
