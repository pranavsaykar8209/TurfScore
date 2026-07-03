import { useMatchConsole } from '../../hooks/useMatchConsole';
import { MatchConsoleCardProps } from '../../types';

export const MatchConsoleCard = ({ data }: MatchConsoleCardProps) => {
  const { joinCode, setJoinCode, handleCreateSession, handleJoinSession } = useMatchConsole();

  return (
    <div className="w-full max-w-[420px] bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl shadow-brand-dark/10 dark:shadow-brand-green/5 border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col transition-colors">
      {/* Header */}
      <div className="px-6 py-5 border-b border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse"></div>
          <span className="font-extrabold text-xs tracking-wider text-slate-900 dark:text-white uppercase transition-colors">
            {data.title}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 transition-colors uppercase">READY • 00:00</span>
      </div>

      {/* Main Content Area */}
      <div className="p-6 bg-white dark:bg-slate-800 transition-colors flex flex-col gap-5">
        
        {/* Score Simulation */}
        <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden shadow-inner transition-colors">
          
          <div className="text-left relative z-10">
            <div className="text-[10px] font-bold text-green-700 dark:text-brand-green uppercase tracking-widest mb-1.5 transition-colors">Turf XI</div>
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1 transition-colors">124<span className="text-slate-500 dark:text-slate-400 font-medium transition-colors">/4</span></div>
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 font-mono tracking-wider transition-colors">15.2 OV • RR 8.15</div>
          </div>
          <div className="text-right relative z-10 flex flex-col items-end justify-between h-full">
            <div className="text-[10px] text-slate-500 font-bold mb-4 transition-colors">VS</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white tracking-wide transition-colors">Rivals</div>
          </div>
        </div>

        {/* Actions */}
        <button 
          onClick={handleCreateSession}
          className="w-full py-3.5 bg-brand-green hover:bg-[#a6d820] text-slate-900 font-bold rounded-xl transition-all shadow-xl shadow-brand-green/20 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
        >
          {data.primaryButton}
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-100 dark:border-slate-700 transition-colors"></div>
          <span className="flex-shrink-0 mx-4 text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold transition-colors">
            Or join a match
          </span>
          <div className="flex-grow border-t border-slate-100 dark:border-slate-700 transition-colors"></div>
        </div>

        <form onSubmit={handleJoinSession} className="flex gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="X Y 7 - 4 2 B"
            className="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-center text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-colors uppercase placeholder:normal-case placeholder:text-slate-300 dark:placeholder:text-slate-500 placeholder:font-bold tracking-widest"
            maxLength={6}
          />
          <button 
            type="submit"
            className="px-6 py-3.5 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-xl shadow-sm hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors active:scale-[0.98]"
          >
            {data.joinButton}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium transition-colors">
          No sign-up required - Free during beta
        </p>
      </div>
    </div>
  );
};
