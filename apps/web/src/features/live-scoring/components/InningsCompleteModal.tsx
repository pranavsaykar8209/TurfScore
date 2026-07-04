import { MatchState } from '../types';

interface InningsCompleteModalProps {
  matchState: MatchState;
  onStartSecondInnings: () => void;
}

export default function InningsCompleteModal({
  matchState,
  onStartSecondInnings,
}: InningsCompleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md animate-in fade-in zoom-in duration-200 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Innings Complete
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          First innings has concluded.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex flex-col items-center">
            <span className="text-xs uppercase font-bold text-slate-500 mb-1">Final Score</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {matchState.totalRuns}/{matchState.totalWickets}
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 flex flex-col items-center">
            <span className="text-xs uppercase font-bold text-slate-500 mb-1">Overs</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {matchState.currentOver}.{matchState.currentBall}
            </span>
          </div>
        </div>

        <div className="bg-brand-primary/10 dark:bg-brand-primary/20 border border-brand-primary/20 rounded-2xl p-4 flex flex-col items-center mb-8">
          <span className="text-xs uppercase font-bold text-brand-primary mb-1">Target to win</span>
          <span className="text-3xl font-bold text-brand-primary">
            {matchState.target}
          </span>
        </div>

        <button
          onClick={onStartSecondInnings}
          className="w-full rounded-2xl h-14 font-bold uppercase text-sm tracking-wider shadow-lg transition-all bg-brand-green text-brand-dark hover:bg-brand-green/90 active:scale-95"
        >
          Start Second Innings
        </button>
      </div>
    </div>
  );
}
