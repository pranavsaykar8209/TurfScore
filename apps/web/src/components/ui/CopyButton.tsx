import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CopyButtonProps } from './types';

export const CopyButton: React.FC<CopyButtonProps> = ({ value, copyValue, label, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue ?? value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          readOnly
          value={value}
          className={cn(
            "w-full rounded-xl border transition-all duration-300 font-mono tracking-widest text-center",
            "px-4 py-3 text-base",
            "bg-slate-50 dark:bg-black/20", // Read-only styling
            "text-slate-900 dark:text-white",
            "border-slate-200 dark:border-white/10",
            "focus:outline-none"
          )}
        />
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "absolute right-2 p-2 rounded-lg transition-colors duration-200 focus:outline-none",
            "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white",
            "hover:bg-slate-200 dark:hover:bg-white/10",
            copied && "text-brand-green dark:text-brand-green hover:text-brand-green"
          )}
          title="Copy code"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
};
