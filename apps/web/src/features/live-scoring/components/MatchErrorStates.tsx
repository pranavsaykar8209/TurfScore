import { Navbar } from '../../../components/shared';
import homeContent from '../../../data/home.json';

export function MatchNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans relative overflow-hidden text-brand-dark dark:text-slate-300 transition-colors">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-green/10 dark:from-brand-green/5 to-transparent pointer-events-none -z-10"></div>
      <Navbar data={homeContent.navbar} />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center text-center z-10">
          <div className="w-24 h-24 bg-brand-green/10 dark:bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl font-bold font-heading">404</span>
          </div>
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-3">
            Match Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Oops! The match you are looking for doesn't exist or is not available. Let's get you back.
          </p>
          <button 
            className="w-full rounded-xl h-12 bg-brand-green hover:bg-brand-green/90 text-slate-900 font-semibold flex items-center justify-center transition-colors shadow-sm"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export function MatchLoadError({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-sans">
      <Navbar data={homeContent.navbar} />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/30 max-w-sm w-full">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button 
            className="w-full rounded-xl h-12 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
