import { useState } from 'react';
import { DeliveryType } from '../types';

interface ScoringKeypadProps {
  onAddDelivery: (params: { runs: number; type?: DeliveryType; isBoundary?: boolean; isWicket?: boolean; wicketType?: string }) => void;
  onUndo: () => void;
  onChangeStrike: () => void;
  canUndo: boolean;
  isFreeHit?: boolean;
}

export default function ScoringKeypad({
  onAddDelivery,
  onUndo,
  onChangeStrike,
  canUndo,
  isFreeHit = false
}: ScoringKeypadProps) {

  const [runs, setRuns] = useState<number>(0);
  const [isBoundary, setIsBoundary] = useState<boolean>(false);
  const [extraType, setExtraType] = useState<DeliveryType>('NORMAL');
  const [isWicket, setIsWicket] = useState<boolean>(false);
  const [wicketType, setWicketType] = useState<string | null>(null);

  const handleRuns = (r: number, bound: boolean = false) => {
    setRuns(r);
    setIsBoundary(bound);
    if (r > 0 && isWicket && wicketType === 'BOWLED') {
      setIsWicket(false);
      setWicketType(null);
    }
    if ((r === 4 || r === 6) && isWicket && wicketType === 'RUN_OUT') {
      setIsWicket(false);
      setWicketType(null);
    }
  };

  const handleExtra = (type: DeliveryType) => {
    if (extraType === type) {
      setExtraType('NORMAL');
    } else {
      setExtraType(type);
    }
  };

  const handleWicket = (type: string) => {
    if (isWicket && wicketType === type) {
      setIsWicket(false);
      setWicketType(null);
    } else {
      setIsWicket(true);
      setWicketType(type);
    }
  };

  const handleRecordBall = () => {
    onAddDelivery({
      runs,
      type: extraType,
      isBoundary,
      isWicket,
      wicketType: wicketType || undefined
    });
    setRuns(0);
    setIsBoundary(false);
    setExtraType('NORMAL');
    setIsWicket(false);
    setWicketType(null);
  };

  const getRunClass = (r: number, bound: boolean = false) => {
    const isSelected = runs === r && isBoundary === bound;
    return `active:scale-95 transition-all rounded-2xl h-12 md:h-auto md:aspect-square flex items-center justify-center text-xl md:text-3xl font-bold ${isSelected ? 'bg-brand-green text-brand-dark ring-2 md:ring-4 ring-brand-green ring-offset-1 md:ring-offset-2 dark:ring-offset-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`;
  };

  const getExtraClass = (type: DeliveryType) => {
    const isSelected = extraType === type;
    return `active:scale-95 transition-all rounded-2xl h-12 md:h-16 flex flex-col items-center justify-center ${isSelected ? 'bg-brand-green text-brand-dark ring-2 md:ring-4 ring-brand-green ring-offset-1 md:ring-offset-2 dark:ring-offset-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`;
  };

  const getWicketClass = (type: string) => {
    const isSelected = isWicket && wicketType === type;
    
    let isDisabled = false;
    if (type === 'BOWLED') {
      isDisabled = isFreeHit || extraType === 'NO_BALL' || runs > 0;
    } else if (type === 'RUN_OUT') {
      isDisabled = runs === 4 || runs === 6;
    }

    if (isDisabled) {
      return `flex-1 transition-all text-white/50 rounded-2xl h-12 md:h-16 flex items-center justify-center bg-red-500/50 cursor-not-allowed`;
    }
    return `flex-1 active:scale-95 transition-all text-white rounded-2xl h-12 md:h-16 flex items-center justify-center ${isSelected ? 'bg-red-500 ring-2 md:ring-4 ring-red-500 ring-offset-1 md:ring-offset-2 dark:ring-offset-slate-900' : 'bg-red-500 hover:bg-red-600'}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-full">

      {/* Runs Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-5 h-full flex flex-col">
        <h3 className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 md:mb-4">Runs</h3>
        <div className="grid grid-cols-6 md:grid-cols-3 gap-2 md:gap-4 flex-1">
          <button onClick={() => handleRuns(0)} className={getRunClass(0)}>0</button>
          <button onClick={() => handleRuns(1)} className={getRunClass(1)}>1</button>
          <button onClick={() => handleRuns(2)} className={getRunClass(2)}>2</button>
          <button onClick={() => handleRuns(3)} className={getRunClass(3)}>3</button>
          <button onClick={() => handleRuns(4, true)} className={getRunClass(4, true)}>4</button>
          <button onClick={() => handleRuns(6, true)} className={getRunClass(6, true)}>6</button>
        </div>
      </div>

      {/* Extras Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-3 h-full">
        <h3 className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 md:mb-4">Extras</h3>
        <div className="grid grid-cols-4 md:grid-cols-2 gap-2 md:gap-4">
          <button onClick={() => handleExtra('WIDE')} className={getExtraClass('WIDE')}>
            <span className="font-bold text-inherit">WD</span>
          </button>
          <button onClick={() => handleExtra('NO_BALL')} className={getExtraClass('NO_BALL')}>
            <span className="font-bold text-inherit">NB</span>
          </button>
          <button onClick={() => handleExtra('BYE')} className={getExtraClass('BYE')}>
            <span className="font-bold text-inherit">BYE</span>
          </button>
          <button onClick={() => handleExtra('LEG_BYE')} className={getExtraClass('LEG_BYE')}>
            <span className="font-bold text-inherit">LB</span>
          </button>
        </div>
      </div>

      {/* Actions & Controls Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-4 h-full flex flex-col">
        <h3 className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 md:mb-4">Actions</h3>

        {/* Wickets */}
        <div className="flex gap-2 md:gap-4 mb-3 md:mb-4">
          <button
            onClick={() => handleWicket('BOWLED')}
            className={getWicketClass('BOWLED')}
            disabled={isFreeHit || extraType === 'NO_BALL' || runs > 0}
          >
            <span className="text-sm md:text-xl font-bold tracking-widest">OUT</span>
          </button>
          <button
            onClick={() => handleWicket('RUN_OUT')}
            className={getWicketClass('RUN_OUT')}
            disabled={runs === 4 || runs === 6}
          >
            <span className="text-sm md:text-xl font-bold tracking-widest">RUN OUT</span>
          </button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-2 md:gap-4 mb-auto">
          <button onClick={onUndo} disabled={!canUndo} className={`bg-slate-200 dark:bg-slate-800 active:scale-95 transition-all text-slate-700 dark:text-slate-300 rounded-2xl h-12 md:h-14 flex items-center justify-center gap-2 ${!canUndo && 'opacity-50 cursor-not-allowed'}`}>
            <span className="text-lg">↺</span>
            <span className="text-xs uppercase font-bold">Undo</span>
          </button>
          <button onClick={onChangeStrike} className="bg-slate-200 dark:bg-slate-800 active:scale-95 transition-all text-slate-700 dark:text-slate-300 rounded-2xl h-12 md:h-14 flex items-center justify-center gap-2">
            <span className="text-lg">⇄</span>
            <span className="text-[10px] md:text-xs uppercase font-bold text-center leading-tight">Change<br/>Strike</span>
          </button>
        </div>

        {/* Match Controls */}
        <div className="flex gap-2 md:gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleRecordBall}
            className="w-full rounded-2xl h-12 md:h-14 font-bold uppercase text-xs md:text-sm tracking-wider bg-brand-green text-brand-dark shadow-lg hover:bg-brand-green/90 active:scale-95 transition-all"
          >
            Record Ball
          </button>
        </div>

      </div>
    </div>
  );
}
