import { motion } from 'framer-motion';

interface SegmentedControlProps {
  options: { id: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SegmentedControl({ options, value, onChange, disabled }: SegmentedControlProps) {
  return (
    <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl relative">
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.id)}
            className={`flex-1 relative py-3 text-sm font-medium rounded-lg transition-colors z-10 ${
              isSelected
                ? 'text-brand-primary dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSelected && (
              <motion.div
                layoutId="segmented-bg"
                className="absolute inset-0 bg-white dark:bg-brand-primary rounded-lg shadow-sm -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="capitalize">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
