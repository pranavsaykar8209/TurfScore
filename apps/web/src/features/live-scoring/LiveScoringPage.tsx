import { useNavigate, useLocation } from 'react-router-dom';
import { useMatchState } from './hooks/useMatchState';
import {

  ScoreboardCard,
  PlayersActiveCard,
  CurrentOverTracker,
  ScoringKeypad,
} from './components';

import { Navbar } from '@/components/shared';
import homeContent from '@/data/home.json';

export default function LiveScoringPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state;

  // Fallback for direct navigation without state
  const sessionData = routeState?.sessionData || { sessionName: 'Local Match', teamA: 'Team A', teamB: 'Team B' };
  const tossData = routeState?.tossData || { winner: 'A', decision: 'BAT' };
  const matchSetup = routeState?.matchSetup || { striker: null, nonStriker: null, bowler: null, overs: 20 };

  const isTeamABatting = 
    (tossData.winner === 'A' && tossData.decision === 'BAT') ||
    (tossData.winner === 'B' && tossData.decision === 'BOWL');

  const battingTeamName = isTeamABatting ? sessionData.teamA : sessionData.teamB;
  const bowlingTeamName = isTeamABatting ? sessionData.teamB : sessionData.teamA;

  const {
    state: matchState,
    addDelivery,
    addWicket,
    undo,
    changeStrike,
    endOver,
    canUndo,
  } = useMatchState({
    striker: matchSetup.striker,
    nonStriker: matchSetup.nonStriker,
    currentBowler: matchSetup.bowler,
  });

  const handleEndInnings = () => {
    // Basic end innings alert for this version
    if (confirm("Are you sure you want to end this innings?")) {
      alert("Innings Ended. Implement 2nd innings logic here.");
    }
  };

  const isOverComplete = matchState.currentBall >= 6;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans pb-12 pt-32">
      <Navbar data={homeContent.navbar} />

      <div className="max-w-5xl w-full mx-auto px-4 mt-6 flex flex-col gap-6">
        
        {/* Top: Scoreboard */}
        <ScoreboardCard 
          battingTeamName={battingTeamName}
          bowlingTeamName={bowlingTeamName}
          matchState={matchState}
        />

        {/* Middle section: Active Players & Over Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <PlayersActiveCard matchState={matchState} />
          </div>
          <div className="lg:col-span-8">
            <CurrentOverTracker matchState={matchState} />
          </div>
        </div>

        {/* Bottom section: Keypad & Controls */}
        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-1">
            <ScoringKeypad 
              onAddDelivery={addDelivery}
              onWicket={addWicket}
              onUndo={undo}
              onChangeStrike={changeStrike}
              canUndo={canUndo}
              onEndOver={endOver}
              canEndOver={isOverComplete}
              onEndInnings={handleEndInnings}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
