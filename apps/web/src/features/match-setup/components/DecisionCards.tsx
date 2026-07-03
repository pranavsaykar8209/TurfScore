import { type TossDecision } from '../types';

interface DecisionCardsProps {
  value: TossDecision;
  onChange: (value: TossDecision) => void;
  disabled?: boolean;
}

export default function DecisionCards({ value, onChange, disabled }: DecisionCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('BAT')}
        className={`relative p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
          value === 'BAT'
            ? 'border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/10'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="text-4xl" role="img" aria-label="Bat">🏏</span>
        <span className={`font-semibold ${value === 'BAT' ? 'text-brand-primary' : 'text-slate-700 dark:text-slate-300'}`}>
          Bat First
        </span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('BOWL')}
        className={`relative p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
          value === 'BOWL'
            ? 'border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/10'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="text-4xl" role="img" aria-label="Ball">🥎</span>
        <span className={`font-semibold ${value === 'BOWL' ? 'text-brand-primary' : 'text-slate-700 dark:text-slate-300'}`}>
          Bowl First
        </span>
      </button>
    </div>
  );
}
