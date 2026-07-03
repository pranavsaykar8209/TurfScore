import { type PlayerSelection } from '../types';

interface LivePreviewCardProps {
  striker: PlayerSelection | null;
  nonStriker: PlayerSelection | null;
  bowler: PlayerSelection | null;
}

export default function LivePreviewCard({ 
  striker, 
  nonStriker, 
  bowler
}: LivePreviewCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">0</span>
              <span className="text-xl text-slate-500 dark:text-slate-400">/ 0</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Overs</p>
            <span className="text-2xl font-bold">0.0</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-3 uppercase tracking-wider">Batting</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-brand-primary">🏏</span>
                <span className={`text-sm capitalize ${striker ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                  {striker ? striker.name : '--'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="opacity-0">🏏</span>
                <span className={`text-sm capitalize ${nonStriker ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                  {nonStriker ? nonStriker.name : '--'}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-3 uppercase tracking-wider">Bowling</p>
            <div className="flex items-center gap-2">
              <span className="text-red-400">🥎</span>
              <span className={`text-sm capitalize ${bowler ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                {bowler ? bowler.name : '--'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
