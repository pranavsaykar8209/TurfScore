import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CalendarDays, Users, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface ReviewStepProps {
  onBack: () => void;
  onSubmit: () => void;
  sessionCode: string;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ onBack, onSubmit, sessionCode }) => {
  const { formState: { isSubmitting } } = useFormContext();
  const sessionName = useWatch({ name: 'sessionName' });
  const teamA = useWatch({ name: 'teamA' });
  const teamB = useWatch({ name: 'teamB' });
  const players = useWatch({ name: 'players' }) || [];

  const teamAPlayers = players.filter((p: any) => p.team === 'A');
  const teamBPlayers = players.filter((p: any) => p.team === 'B');

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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Review & Confirm</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review your session details before creating.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Session Details Card */}
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-[#1A243A] border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-brand-green" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Session Details</h3>
            </div>
            <div className="flex flex-col gap-3 mt-2">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Session Name</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{sessionName || 'Untitled Session'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Session Code</p>
                <p className="text-sm font-mono tracking-wider font-medium text-slate-900 dark:text-slate-200">{sessionCode}</p>
              </div>
            </div>
          </div>

          {/* Team A Details Card */}
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-[#1A243A] border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400 dark:text-slate-300" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Team A - {teamA || 'Team A'}</h3>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {teamAPlayers.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">No players added</p>
              ) : (
                teamAPlayers.map((player: any) => (
                  <div key={player.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{player.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Team B Details Card */}
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-[#1A243A] border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400 dark:text-slate-300" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Team B - {teamB || 'Team B'}</h3>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {teamBPlayers.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">No players added</p>
              ) : (
                teamBPlayers.map((player: any) => (
                  <div key={player.id} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{player.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-200 dark:border-white/10">
          <Button onClick={onBack} type="button" variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={onSubmit} type="button" isLoading={isSubmitting} className="flex items-center justify-center gap-2 px-8">
            <CheckCircle2 className="w-5 h-5" />
            Create Session
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
