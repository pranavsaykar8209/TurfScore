import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { Navbar } from '../components/shared';
import homeContent from '../data/home.json';
import { SearchableSelect, LivePreviewCard } from '../features/match-setup/components';
import { type PlayerSelection } from '../features/match-setup/types';

// Mock data fallback
const MOCK_DATA = {
  sessionData: {
    sessionName: 'Weekend Match',
    teamA: 'Mumbai Indians',
    teamB: 'Chennai Super Kings',
    players: [
      { id: '1', name: 'Rohit Sharma', team: 'A' },
      { id: '2', name: 'Suryakumar Yadav', team: 'A' },
      { id: '3', name: 'Ishan Kishan', team: 'A' },
      { id: '4', name: 'Jasprit Bumrah', team: 'A' },
      { id: '5', name: 'MS Dhoni', team: 'B' },
      { id: '6', name: 'Ravindra Jadeja', team: 'B' },
      { id: '7', name: 'Ruturaj Gaikwad', team: 'B' },
      { id: '8', name: 'Deepak Chahar', team: 'B' },
    ]
  },
  tossData: {
    result: 'HEAD',
    winner: 'A',
    decision: 'BAT',
    overs: 20
  }
};

export default function MatchSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { sessionData, tossData } = location.state || MOCK_DATA;

  // Determine Batting and Bowling Teams based on Toss
  const isTeamABatting = 
    (tossData.winner === 'A' && tossData.decision === 'BAT') ||
    (tossData.winner === 'B' && tossData.decision === 'BOWL');

  const battingTeamName = isTeamABatting ? sessionData.teamA : sessionData.teamB;
  const bowlingTeamName = isTeamABatting ? sessionData.teamB : sessionData.teamA;
  
  const battingTeamId = isTeamABatting ? 'A' : 'B';
  const bowlingTeamId = isTeamABatting ? 'B' : 'A';

  const tossWinnerName = tossData.winner === 'A' ? sessionData.teamA : sessionData.teamB;

  const battingPlayers = sessionData.players.filter((p: any) => p.team === battingTeamId);
  const bowlingPlayers = sessionData.players.filter((p: any) => p.team === bowlingTeamId);

  const [striker, setStriker] = useState<PlayerSelection | null>(null);
  const [nonStriker, setNonStriker] = useState<PlayerSelection | null>(null);
  const [bowler, setBowler] = useState<PlayerSelection | null>(null);

  const isComplete = striker && nonStriker && bowler;

  const handleStartMatch = () => {
    if (!isComplete) return;
    navigate('/live-scoring', {
      state: {
        sessionData,
        tossData,
        matchSetup: { striker, nonStriker, bowler, overs: tossData.overs }
      }
    });
  };

  return (
    <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col">
      <Navbar data={homeContent.navbar} />
      {/* Header */}
      <div className="max-w-4xl w-full mx-auto px-4 pt-36 flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Match Setup</h1>
          <p className="text-slate-600 dark:text-slate-400">Set up your match details and opening players.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="max-w-4xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column */}
          <div className="flex flex-col gap-8">
          
          {/* Match Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Batting</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize">{battingTeamName}</span>
              </div>
              <div className="text-center px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                <span className="text-xs font-bold text-slate-500">VS</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bowling</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize">{bowlingTeamName}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Toss</span>
              <span className="font-medium text-slate-900 dark:text-white capitalize">
                {tossWinnerName} won ({tossData.decision})
              </span>
            </div>
          </div>

          {/* Opening Batters */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🏏</span>
              <h2 className="font-semibold text-slate-900 dark:text-white">Opening Batters</h2>
            </div>
            <div className="space-y-4">
              <SearchableSelect
                label="Striker"
                placeholder="Select Striker"
                options={battingPlayers}
                value={striker}
                onChange={setStriker}
                disabledOptions={nonStriker ? [nonStriker.id] : []}
              />
              <SearchableSelect
                label="Non-Striker"
                placeholder="Select Non-Striker"
                options={battingPlayers}
                value={nonStriker}
                onChange={setNonStriker}
                disabledOptions={striker ? [striker.id] : []}
              />
            </div>
          </section>

          {/* Opening Bowler */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🥎</span>
              <h2 className="font-semibold text-slate-900 dark:text-white">Opening Bowler</h2>
            </div>
            <SearchableSelect
              label="Bowler"
              placeholder="Select Bowler"
              options={bowlingPlayers}
              value={bowler}
              onChange={setBowler}
              placement="top"
            />
          </section>

          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8 h-full">

          {/* Live Preview Card */}
          <LivePreviewCard 
            striker={striker}
            nonStriker={nonStriker}
            bowler={bowler}
          />

          {/* Checklist Card */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Pre-Match Checklist</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-brand-primary dark:text-brand-green">
                <CheckCircle2 className="w-4 h-4" />
                <span>Toss Completed</span>
              </li>
              <li className="flex items-center gap-2 text-brand-primary dark:text-brand-green">
                <CheckCircle2 className="w-4 h-4" />
                <span>Teams Selected</span>
              </li>
              <li className={`flex items-center gap-2 transition-colors ${striker && nonStriker ? 'text-brand-primary dark:text-brand-green' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>Opening Batters Selected</span>
              </li>
              <li className={`flex items-center gap-2 transition-colors ${bowler ? 'text-brand-primary dark:text-brand-green' : 'text-slate-400'}`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>Opening Bowler Selected</span>
              </li>
            </ul>
          </div>

          <div className="mt-auto">
            <Button 
              className="w-full shadow-lg"
              size="lg"
              onClick={handleStartMatch}
              disabled={!isComplete}
            >
              🏏 Start Match
            </Button>
          </div>

          </div>

        </div>
      </div>

    </div>
  );
}
