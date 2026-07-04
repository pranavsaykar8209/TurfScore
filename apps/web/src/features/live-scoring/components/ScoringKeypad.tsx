import { DeliveryType } from '../types';

interface ScoringKeypadProps {
  onAddDelivery: (runs: number, type?: DeliveryType, isBoundary?: boolean) => void;
  onWicket: () => void;
  onUndo: () => void;
  onChangeStrike: () => void;
  canUndo: boolean;
  onEndOver: () => void;
  canEndOver: boolean;
  onEndInnings: () => void;
}

export default function ScoringKeypad({ 
  onAddDelivery, 
  onWicket, 
  onUndo, 
  onChangeStrike,
  canUndo,
  onEndOver,
  canEndOver,
  onEndInnings
}: ScoringKeypadProps) {
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
      
      {/* Runs Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-5 h-full flex flex-col">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Runs</h3>
        <div className="grid grid-cols-3 gap-4 flex-1">
          <button onClick={() => onAddDelivery(0)} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all rounded-2xl aspect-square flex items-center justify-center text-3xl font-bold text-slate-900 dark:text-white">0</button>
          <button onClick={() => onAddDelivery(1)} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all rounded-2xl aspect-square flex items-center justify-center text-3xl font-bold text-slate-900 dark:text-white">1</button>
          <button onClick={() => onAddDelivery(2)} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all rounded-2xl aspect-square flex items-center justify-center text-3xl font-bold text-slate-900 dark:text-white">2</button>
          <button onClick={() => onAddDelivery(3)} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all rounded-2xl aspect-square flex items-center justify-center text-3xl font-bold text-slate-900 dark:text-white">3</button>
          <button onClick={() => onAddDelivery(4, 'NORMAL', true)} className="bg-brand-green text-brand-dark hover:bg-brand-green/90 active:scale-95 transition-all rounded-2xl aspect-square flex items-center justify-center text-4xl font-bold shadow-[0_0_20px_rgba(184,255,26,0.3)]">4</button>
          <button onClick={() => onAddDelivery(6, 'NORMAL', true)} className="bg-brand-green text-brand-dark hover:bg-brand-green/90 active:scale-95 transition-all rounded-2xl aspect-square flex items-center justify-center text-4xl font-bold shadow-[0_0_20px_rgba(184,255,26,0.3)]">6</button>
        </div>
      </div>

      {/* Extras Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-3 h-full">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Extras</h3>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onAddDelivery(0, 'WIDE')} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all rounded-2xl h-16 flex flex-col items-center justify-center">
            <span className="font-bold text-slate-900 dark:text-white">WD</span>
            <span className="text-[10px] text-slate-500 uppercase">Wide</span>
          </button>
          <button onClick={() => onAddDelivery(0, 'NO_BALL')} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all rounded-2xl h-16 flex flex-col items-center justify-center">
            <span className="font-bold text-slate-900 dark:text-white">NB</span>
            <span className="text-[10px] text-slate-500 uppercase">No Ball</span>
          </button>
          <button onClick={() => onAddDelivery(1, 'BYE')} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all rounded-2xl h-16 flex flex-col items-center justify-center">
            <span className="font-bold text-slate-900 dark:text-white">BYE</span>
            <span className="text-[10px] text-slate-500 uppercase">Bye</span>
          </button>
          <button onClick={() => onAddDelivery(1, 'LEG_BYE')} className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all rounded-2xl h-16 flex flex-col items-center justify-center">
            <span className="font-bold text-slate-900 dark:text-white">LB</span>
            <span className="text-[10px] text-slate-500 uppercase">Leg Bye</span>
          </button>
        </div>
      </div>

      {/* Actions & Controls Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-4 h-full flex flex-col">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Actions</h3>
        
        {/* Wicket */}
        <button onClick={onWicket} className="w-full bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white rounded-2xl h-16 flex items-center justify-center mb-4">
          <span className="text-xl font-bold tracking-widest">WICKET</span>
        </button>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4 mb-auto">
          <button onClick={onUndo} disabled={!canUndo} className={`bg-slate-200 dark:bg-slate-800 active:scale-95 transition-all text-slate-700 dark:text-slate-300 rounded-2xl h-14 flex items-center justify-center gap-2 ${!canUndo && 'opacity-50 cursor-not-allowed'}`}>
            <span className="text-lg">↺</span>
            <span className="text-xs uppercase font-bold">Undo</span>
          </button>
          <button onClick={onChangeStrike} className="bg-slate-200 dark:bg-slate-800 active:scale-95 transition-all text-slate-700 dark:text-slate-300 rounded-2xl h-14 flex items-center justify-center gap-2">
            <span className="text-lg">⇄</span>
            <span className="text-xs uppercase font-bold text-center leading-tight">Change<br/>Strike</span>
          </button>
        </div>

        {/* Match Controls */}
        <div className="flex gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={onEndOver}
            disabled={!canEndOver}
            className={`flex-1 rounded-2xl h-14 font-bold uppercase text-xs tracking-wider border-2 ${canEndOver ? 'border-brand-primary text-brand-primary hover:bg-brand-primary/10 active:scale-95' : 'border-slate-200 text-slate-400 dark:border-slate-700 opacity-50 cursor-not-allowed'}`}
          >
            End Over
          </button>
          <button 
            onClick={onEndInnings}
            className="flex-1 rounded-2xl h-14 font-bold uppercase text-xs tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 active:scale-95"
          >
            End Innings
          </button>
        </div>

      </div>
    </div>
  );
}
