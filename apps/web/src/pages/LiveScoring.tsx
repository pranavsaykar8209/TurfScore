import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { Navbar } from '../components/shared';
import homeContent from '../data/home.json';

export default function LiveScoring() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col">
      <Navbar data={homeContent.navbar} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-24">
      <div className="bg-brand-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-6">
        <PlayCircle className="w-12 h-12 text-brand-primary" />
      </div>
      
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
        Live Scoring Placeholder
      </h1>
      
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
        Match setup is complete! The live scoring interface will be implemented here.
      </p>

      {state && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-md w-full text-left mb-8 space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Match Data Received
          </h2>
          
          <div className="text-sm">
            <span className="text-slate-500">Striker:</span>
            <span className="ml-2 font-medium text-slate-900 dark:text-white">
              {state.matchSetup?.striker?.name}
            </span>
          </div>
          
          <div className="text-sm">
            <span className="text-slate-500">Non-Striker:</span>
            <span className="ml-2 font-medium text-slate-900 dark:text-white">
              {state.matchSetup?.nonStriker?.name}
            </span>
          </div>
          
          <div className="text-sm">
            <span className="text-slate-500">Bowler:</span>
            <span className="ml-2 font-medium text-slate-900 dark:text-white">
              {state.matchSetup?.bowler?.name}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="text-brand-primary hover:underline flex items-center gap-2 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home
      </button>
      </div>
    </div>
  );
}
