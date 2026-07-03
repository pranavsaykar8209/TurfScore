import React from 'react';
import { Card } from '../../../components/ui/Card';
import { PlayerCard } from './PlayerCard';
import { EmptyState } from './EmptyState';
import { PlayerListProps } from '../types';

export const PlayerList: React.FC<PlayerListProps> = ({ teamId, teamName, players, onEditPlayer, onDeletePlayer }) => {
  const teamPlayers = players.filter(p => p.team === teamId);
  const isTeamA = teamId === 'A';

  return (
    <Card className="p-4 md:p-5 flex flex-col gap-4 bg-slate-50/50 dark:bg-white/[0.01]">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isTeamA ? 'bg-brand-green shadow-[0_0_8px_rgba(184,255,26,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {teamName || `Team ${teamId}`}
          </h3>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-xs font-medium text-slate-700 dark:text-slate-300">
          {teamPlayers.length} {teamPlayers.length === 1 ? 'Player' : 'Players'}
        </div>
      </div>

      <div className="flex flex-col gap-2 min-h-[150px]">
        {teamPlayers.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState 
              title="No players" 
              description={`Add players to ${teamName || `Team ${teamId}`}`} 
            />
          </div>
        ) : (
          teamPlayers.map(player => (
            <PlayerCard
              key={player.id}
              id={player.id}
              name={player.name}
              onEdit={onEditPlayer}
              onDelete={onDeletePlayer}
            />
          ))
        )}
      </div>
    </Card>
  );
};
