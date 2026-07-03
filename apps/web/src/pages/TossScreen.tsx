import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { Navbar } from '../components/shared';
import homeContent from '../data/home.json';
import { CoinToss, SegmentedControl, DecisionCards } from '../features/match-setup/components';
import { type TossWinner, type TossDecision } from '../features/match-setup/types';

// Mock session data for development if accessed directly
const MOCK_SESSION_DATA = {
  sessionName: 'Weekend Match',
  teamA: 'Mumbai Indians',
  teamB: 'Chennai Super Kings',
  players: [
    { id: '1', name: 'Rohit Sharma', team: 'A' },
    { id: '2', name: 'Suryakumar Yadav', team: 'A' },
    { id: '3', name: 'MS Dhoni', team: 'B' },
    { id: '4', name: 'Ravindra Jadeja', team: 'B' }
  ]
};

export default function TossScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get session data from router state, or use mock data
  const sessionData = location.state?.sessionData || MOCK_SESSION_DATA;
  
  const [tossResult, setTossResult] = useState<'HEAD' | 'TAIL' | null>(null);
  const [tossWinner, setTossWinner] = useState<TossWinner>(null);
  const [decision, setDecision] = useState<TossDecision>(null);

  const teamOptions = [
    { id: 'A', label: sessionData.teamA },
    { id: 'B', label: sessionData.teamB }
  ];

  const isComplete = tossResult && tossWinner && decision;

  const handleContinue = () => {
    if (!isComplete) return;
    navigate('/match-setup', { 
      state: { 
        sessionData, 
        tossData: { result: tossResult, winner: tossWinner, decision }
      } 
    });
  };

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col">
      <Navbar data={homeContent.navbar} />
      {/* Header */}
      <div className="max-w-4xl w-full mx-auto px-4 pt-36 flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Toss</h1>
          <p className="text-slate-600 dark:text-slate-400">Let's decide who bats first.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="max-w-4xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8 self-start">
          
          {/* Hero Match Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xl md:text-3xl font-bold text-center text-slate-900 dark:text-white capitalize leading-none">{sessionData.teamA}</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Team A</span>
            </div>
            
            <div className="px-6 py-2 mx-4 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-bold text-slate-500 dark:text-slate-400">
              VS
            </div>

            <div className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xl md:text-3xl font-bold text-center text-slate-900 dark:text-white capitalize leading-none">{sessionData.teamB}</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Team B</span>
            </div>
          </div>

          {/* Coin Toss Section */}
          <section className="h-fit">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Coin Toss</h2>
            <CoinToss onResult={setTossResult} />
          </section>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">

          {/* Toss Winner */}
          <section className={`transition-opacity duration-300 ${!tossResult ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Toss Winner</h2>
            <SegmentedControl 
              options={teamOptions}
              value={tossWinner}
              onChange={(val) => setTossWinner(val as TossWinner)}
              disabled={!tossResult}
            />
          </section>

          {/* Decision */}
          <section className={`transition-opacity duration-300 ${!tossWinner ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Decision</h2>
            <DecisionCards 
              value={decision}
              onChange={setDecision}
              disabled={!tossWinner}
            />
          </section>

          {/* Bottom Summary Card */}
          {isComplete && (
            <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Match</span>
                <span className="font-medium text-slate-900 dark:text-white capitalize">{sessionData.teamA} vs {sessionData.teamB}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Toss Winner</span>
                <span className="font-medium text-brand-primary capitalize">
                  {tossWinner === 'A' ? sessionData.teamA : sessionData.teamB}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-400">Decision</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  Chose to {decision === 'BAT' ? 'Bat' : 'Bowl'}
                </span>
              </div>
            </div>
          )}

          {/* Continue Button */}
          {isComplete && (
            <Button 
              className="w-full mt-4"
              size="lg"
              onClick={handleContinue}
              disabled={!isComplete}
            >
              Continue →
            </Button>
          )}
          </div>

        </div>
      </div>

    </div>
  );
}
