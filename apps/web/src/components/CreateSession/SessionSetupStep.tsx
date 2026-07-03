import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';
import { ArrowRight } from 'lucide-react';

interface SessionSetupStepProps {
  onNext: () => void;
  sessionCode: string;
}

export const SessionSetupStep: React.FC<SessionSetupStepProps> = ({ onNext, sessionCode }) => {
  const { register, formState: { errors }, trigger } = useFormContext();

  const handleNext = async () => {
    const isStepValid = await trigger(['sessionName', 'teamA', 'teamB']);
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Session & Teams</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Add basic details and team names.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Session Name"
            placeholder="e.g. Sunday Evening Match"
            {...register('sessionName')}
            error={errors.sessionName?.message as string}
          />
          <CopyButton 
            label="Session Code" 
            value={sessionCode} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Team A Name"
            placeholder="e.g. Tigers"
            {...register('teamA')}
            error={errors.teamA?.message as string}
          />
          <Input
            label="Team B Name"
            placeholder="e.g. Warriors"
            {...register('teamB')}
            error={errors.teamB?.message as string}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} type="button" className="group">
            Next
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
