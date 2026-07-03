import React from 'react';
import { User, Edit2, Trash2 } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { PlayerCardProps } from '../types';

export const PlayerCard: React.FC<PlayerCardProps> = ({ id, name, onEdit, onDelete }) => {
  return (
    <div className={cn(
      "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200",
      "bg-white dark:bg-[#1A243A] border border-slate-100 dark:border-white/5",
      "hover:border-slate-200 dark:hover:border-white/10 hover:shadow-sm"
    )}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
          <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </div>
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 capitalize">{name}</span>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onEdit?.(id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
