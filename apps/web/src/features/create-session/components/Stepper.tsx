import React from 'react';
import { cn } from '../../../utils/cn';
import { ClipboardList, Users, CheckSquare } from 'lucide-react';
import { StepperProps } from '../types';

export const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Connecting Lines Container */}
        <div className="absolute left-[20px] top-[20px] -translate-y-1/2 w-[calc(100%-40px)] h-0.5 z-0">
          <div className="absolute inset-0 bg-slate-200 dark:bg-white/10" />
          <div 
            className="absolute left-0 top-0 h-full bg-brand-green transition-all duration-500 ease-in-out" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300",
                  isActive || isCompleted
                    ? "bg-brand-green text-brand-dark shadow-[0_0_15px_rgba(184,255,26,0.3)]"
                    : "bg-white dark:bg-[#161F33] text-slate-500 dark:text-slate-400 border-2 border-slate-200 dark:border-white/10"
                )}
              >
                {step.id === 1 && <ClipboardList className="w-5 h-5" />}
                {step.id === 2 && <Users className="w-5 h-5" />}
                {step.id === 3 && <CheckSquare className="w-5 h-5" />}
              </div>
              <div className="text-center mt-2">
                <p className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  isActive ? "text-green-700 dark:text-brand-green" : "text-slate-600 dark:text-slate-400"
                )}>
                  {step.title}
                </p>
                {step.subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-500">{step.subtitle}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Compact Stepper */}
      <div className="flex md:hidden flex-col gap-2">
        <div className="flex items-center justify-between text-sm font-medium text-slate-600 dark:text-slate-400">
          <span>Step {currentStep} of {steps.length}</span>
          <span className={cn("text-green-700 dark:text-brand-green font-semibold")}>
            {steps[currentStep - 1]?.title}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-green transition-all duration-500 ease-in-out rounded-full shadow-[0_0_10px_rgba(184,255,26,0.5)]"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
