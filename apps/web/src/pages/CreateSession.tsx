import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { Stepper, SessionSetupStep, AddPlayersStep, ReviewStep } from '../features/create-session/components';
import { Navbar } from '../components/shared';
import homeContent from '../data/home.json';

// Validation Schema
const sessionSchema = z.object({
  sessionName: z.string().min(1, 'Session name is required'),
  teamA: z.string().min(1, 'Team A name is required'),
  teamB: z.string().min(1, 'Team B name is required'),
  players: z.array(z.object({
    id: z.string(),
    name: z.string(),
    team: z.enum(['A', 'B'])
  })).superRefine((players, ctx) => {
    const teamA = players.filter(p => p.team === 'A').length;
    const teamB = players.filter(p => p.team === 'B').length;
    
    if (teamA < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Team A needs at least 2 players.' });
    }
    if (teamB < 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Team B needs at least 2 players.' });
    }
    if (Math.abs(teamA - teamB) > 2) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Difference between teams cannot exceed 2 players.' });
    }
  })
});

type SessionFormData = z.infer<typeof sessionSchema>;

const STEPS = [
  { id: 1, title: 'Session & Teams', subtitle: 'Basic details' },
  { id: 2, title: 'Add Players', subtitle: 'Team rosters' },
  { id: 3, title: 'Review & Confirm', subtitle: 'Final check' }
];

export default function CreateSession() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionCode, setSessionCode] = useState('');

  const methods = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    mode: 'onChange',
    defaultValues: {
      sessionName: '',
      teamA: '',
      teamB: '',
      players: []
    }
  });

  // Generate a mock session code on mount
  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const formattedCode = code.split('').join(' ');
    setSessionCode(formattedCode);
  }, []);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: SessionFormData) => {
    console.log('Session Created:', { ...data, sessionCode });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark transition-colors duration-300 flex flex-col">
      <Navbar data={homeContent.navbar} />
      
      <div className="max-w-4xl w-full mx-auto px-4 pt-36 pb-12 flex flex-col gap-8 md:gap-12 flex-1">
        
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create New Session</h1>
            <p className="text-slate-600 dark:text-slate-400">Follow the steps below to set up your cricket session.</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="px-2 md:px-12">
          <Stepper currentStep={currentStep} steps={STEPS} />
        </div>

        {/* Form Content */}
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="w-full">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <SessionSetupStep 
                  key="step1" 
                  onNext={handleNext} 
                  sessionCode={sessionCode} 
                />
              )}
              {currentStep === 2 && (
                <AddPlayersStep 
                  key="step2" 
                  onNext={handleNext} 
                  onBack={handleBack} 
                />
              )}
              {currentStep === 3 && (
                <ReviewStep 
                  key="step3" 
                  onBack={handleBack} 
                  onSubmit={methods.handleSubmit(onSubmit)} 
                  sessionCode={sessionCode} 
                />
              )}
            </AnimatePresence>
          </form>
        </FormProvider>

        {/* Footer */}
        <div className="text-center pb-8 pt-4">
          <p className="text-xs text-slate-500 dark:text-slate-500 flex items-center justify-center gap-2">
            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">✓</span>
            No sign-up required • Free during beta
          </p>
        </div>

      </div>
    </div>
  );
}
