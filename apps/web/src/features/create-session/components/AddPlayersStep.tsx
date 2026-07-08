import React, { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { PlayerList } from './PlayerList';
import { AddPlayersStepProps } from '../types';

export const AddPlayersStep: React.FC<AddPlayersStepProps> = ({ onNext, onBack, isLoading }) => {
  const { setValue, trigger, formState: { errors } } = useFormContext();
  const [playerName, setPlayerName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>('A');

  // Watch form values to keep UI in sync
  const teamA = useWatch({ name: 'teamA' });
  const teamB = useWatch({ name: 'teamB' });
  const players = useWatch({ name: 'players' }) || [];

  const handleAddPlayer = () => {
    if (!playerName.trim()) return;

    const newPlayer = {
      id: Math.random().toString(36).substr(2, 9),
      name: playerName.trim(),
      team: selectedTeam,
    };

    setValue('players', [...players, newPlayer], { shouldValidate: true });
    setPlayerName('');
  };

  const handleDeletePlayer = (id: string) => {
    setValue('players', players.filter((p: any) => p.id !== id), { shouldValidate: true });
  };

  const handleEditPlayer = (id: string) => {
    const playerToEdit = players.find((p: any) => p.id === id);
    if (playerToEdit) {
      setPlayerName(playerToEdit.name);
      setSelectedTeam(playerToEdit.team);
      handleDeletePlayer(id);
    }
  };

  const handleNextClick = async () => {
    const isStepValid = await trigger('players');
    if (isStepValid) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="w-full flex flex-col gap-6"
    >
      <Card className="p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Players</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Add players to both teams.</p>
        </div>

        {/* Add Player Form */}
        <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10">
          <div className="flex-1 w-full">
            <Input
              label="Player Name"
              placeholder="e.g. Virat Kohli"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPlayer();
                }
              }}
            />
          </div>
          <div className="flex-1 w-full flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Select Team
            </label>
            <div className="relative">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value as 'A' | 'B')}
                className="w-full appearance-none rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-brand-card-dark px-4 py-3 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green transition-all capitalize"
              >
                <option value="A">{teamA || 'Team A'}</option>
                <option value="B">{teamB || 'Team B'}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <Button 
              type="button" 
              onClick={handleAddPlayer}
              disabled={!playerName.trim()}
              className="w-full md:w-auto flex items-center justify-center gap-2 group"
            >
              <span className="font-bold">Add Player</span>
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Player Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <PlayerList
            teamId="A"
            teamName={teamA}
            players={players}
            onEditPlayer={handleEditPlayer}
            onDeletePlayer={handleDeletePlayer}
          />
          <PlayerList
            teamId="B"
            teamName={teamB}
            players={players}
            onEditPlayer={handleEditPlayer}
            onDeletePlayer={handleDeletePlayer}
          />
        </div>

        {errors.players?.message && (
          <div className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20 text-center">
            {errors.players.message as string}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-200 dark:border-white/10">
          <Button onClick={onBack} type="button" variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleNextClick} type="button" className="group" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Next'}
            {!isLoading && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
