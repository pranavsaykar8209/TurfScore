import React from 'react';
import { Users } from 'lucide-react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "No players added", 
  description = "Add players above to see them here.",
  className
}) => {
  return (
    <div className={cn(
      "w-full flex flex-col items-center justify-center p-8 text-center rounded-xl",
      "border-2 border-dashed border-slate-200 dark:border-white/10",
      "bg-slate-50/50 dark:bg-white/[0.02]",
      className
    )}>
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4">
        <Users className="w-6 h-6 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
};
