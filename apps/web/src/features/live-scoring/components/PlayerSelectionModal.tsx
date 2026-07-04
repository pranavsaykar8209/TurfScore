import { useState } from 'react';
import { PlayerSelection } from '../../match-setup/types';
import SearchableSelect from '../../match-setup/components/SearchableSelect';

interface PlayerSelectionModalProps {
  type: 'BATSMAN' | 'BOWLER';
  options: PlayerSelection[];
  disabledOptionIds?: string[];
  onSubmit: (selectedPlayer: PlayerSelection, outPlayerId?: string) => void;
  // For Batsman selection (Run Out case)
  currentStriker?: PlayerSelection | null;
  currentNonStriker?: PlayerSelection | null;
  pendingWicketType?: string;
}

export default function PlayerSelectionModal({
  type,
  options,
  disabledOptionIds = [],
  onSubmit,
  currentStriker,
  currentNonStriker,
  pendingWicketType
}: PlayerSelectionModalProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerSelection | null>(null);
  const [outPlayerId, setOutPlayerId] = useState<string | undefined>(
    type === 'BATSMAN' && pendingWicketType !== 'RUN_OUT' ? currentStriker?.id : undefined
  );

  // If selecting a batsman and we haven't picked who is out yet, show a step to pick who got out
  const showWhoIsOutSelection = type === 'BATSMAN' && !outPlayerId && currentStriker && currentNonStriker;

  const handleSubmit = () => {
    if (selectedPlayer) {
      onSubmit(selectedPlayer, outPlayerId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md animate-in fade-in zoom-in duration-200">
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          {type === 'BATSMAN' ? 'Select Next Batsman' : 'Select Next Bowler'}
        </h2>

        {showWhoIsOutSelection ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">WHO GOT OUT?</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setOutPlayerId(currentStriker.id)}
                className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-brand-primary transition-colors flex flex-col items-center gap-2"
              >
                <span className="text-xs uppercase font-bold text-slate-500">Striker</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">{currentStriker.name}</span>
              </button>
              <button 
                onClick={() => setOutPlayerId(currentNonStriker.id)}
                className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-brand-primary transition-colors flex flex-col items-center gap-2"
              >
                <span className="text-xs uppercase font-bold text-slate-500">Non-Striker</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">{currentNonStriker.name}</span>
              </button>
            </div>
            {/* Quick action if we know it was the striker (e.g. bowled) */}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <SearchableSelect
              label={type === 'BATSMAN' ? 'New Batsman' : 'New Bowler'}
              placeholder={`Search ${type.toLowerCase()}...`}
              options={options}
              value={selectedPlayer}
              onChange={setSelectedPlayer}
              disabledOptions={disabledOptionIds}
              placement="bottom"
            />

            <button
              onClick={handleSubmit}
              disabled={!selectedPlayer}
              className={`w-full rounded-2xl h-14 font-bold uppercase text-sm tracking-wider shadow-lg transition-all ${
                selectedPlayer 
                  ? 'bg-brand-green text-brand-dark hover:bg-brand-green/90 active:scale-95'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              Confirm Selection
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
