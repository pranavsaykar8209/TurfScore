import React from 'react';

interface PartnershipCardProps {
  runs: number;
  balls: number;
}

export const PartnershipCard: React.FC<PartnershipCardProps> = ({ runs, balls }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] p-3 md:p-4 shadow-sm flex flex-col h-full items-center justify-center text-center">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
        Partnership
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-brand-dark dark:text-brand-green leading-none tracking-tighter">
          {runs}
        </span>
        <span className="text-sm font-bold text-slate-400">({balls})</span>
      </div>
    </div>
  );
};
