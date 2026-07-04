import { useState } from 'react';
import { PlayerSelection } from '../../match-setup/types';
import SearchableSelect from '../../match-setup/components/SearchableSelect';

interface OpeningBatsmenSelectionModalProps {
  options: PlayerSelection[];
  onSubmit: (striker: PlayerSelection, nonStriker: PlayerSelection) => void;
}

export default function OpeningBatsmenSelectionModal({
  options,
  onSubmit,
}: OpeningBatsmenSelectionModalProps) {
  const [striker, setStriker] = useState<PlayerSelection | null>(null);
  const [nonStriker, setNonStriker] = useState<PlayerSelection | null>(null);

  const handleSubmit = () => {
    if (striker && nonStriker) {
      onSubmit(striker, nonStriker);
    }
  };

  const isComplete = striker && nonStriker;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-md animate-in fade-in zoom-in duration-200">
        
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
          Select Opening Batsmen
        </h2>

        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <SearchableSelect
              label="Striker"
              placeholder="Select Striker"
              options={options}
              value={striker}
              onChange={setStriker}
              disabledOptions={nonStriker ? [nonStriker.id] : []}
              placement="bottom"
            />
            <SearchableSelect
              label="Non-Striker"
              placeholder="Select Non-Striker"
              options={options}
              value={nonStriker}
              onChange={setNonStriker}
              disabledOptions={striker ? [striker.id] : []}
              placement="bottom"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`w-full rounded-2xl h-14 font-bold uppercase text-sm tracking-wider shadow-lg transition-all ${
              isComplete 
                ? 'bg-brand-green text-brand-dark hover:bg-brand-green/90 active:scale-95'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            Confirm Selection
          </button>
        </div>

      </div>
    </div>
  );
}
