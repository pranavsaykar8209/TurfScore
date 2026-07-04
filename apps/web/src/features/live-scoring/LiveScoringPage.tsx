import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useMatchState } from './hooks/useMatchState';
import {

  ScoreboardCard,
  PlayersActiveCard,
  CurrentOverTracker,
  ScoringKeypad,
  PlayerSelectionModal,
} from './components';

import { Navbar } from '@/components/shared';
import homeContent from '@/data/home.json';

export default function LiveScoringPage() {
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

  const battingTeamId = isTeamABatting ? 'A' : 'B';
  const bowlingTeamId = isTeamABatting ? 'B' : 'A';

  const battingPlayers = sessionData.players?.filter((p: any) => p.team === battingTeamId) || [];
  const bowlingPlayers = sessionData.players?.filter((p: any) => p.team === bowlingTeamId) || [];

  const {
    state: matchState,
    addDelivery,
    undo,
    changeStrike,
    setNewBatsman,
    setNewBowler,
    canUndo,
  } = useMatchState({
    striker: matchSetup.striker,
    nonStriker: matchSetup.nonStriker,
    currentBowler: matchSetup.bowler,
  });

  const [showStrikeWarning, setShowStrikeWarning] = useState(false);

  const handleSetNewBatsman = (player: any, outPlayerId?: string) => {
    if (matchState.pendingWicketType === 'RUN_OUT') {
      setShowStrikeWarning(true);
      setTimeout(() => setShowStrikeWarning(false), 5000);
    }
    setNewBatsman(player, outPlayerId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans pb-12 pt-32 relative">
      <Navbar data={homeContent.navbar} />

      <div className="max-w-5xl w-full mx-auto px-4 mt-6 flex flex-col gap-6">
        
        {/* Top: Scoreboard */}
        <ScoreboardCard 
          battingTeamName={battingTeamName}
          bowlingTeamName={bowlingTeamName}
          matchState={matchState}
          totalOvers={matchSetup.overs}
        />

        {/* Middle section: Active Players & Over Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <PlayersActiveCard matchState={matchState} highlightStrikeChange={showStrikeWarning} />
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
              onUndo={undo}
              onChangeStrike={changeStrike}
              canUndo={canUndo}
              isFreeHit={matchState.isFreeHit}
            />
          </div>
        </div>
      </div>

      {matchState.needsNewBatsman && (
        <PlayerSelectionModal 
          type="BATSMAN"
          options={battingPlayers.filter(p => !matchState.outPlayers?.includes(p.id))}
          currentStriker={matchState.striker}
          currentNonStriker={matchState.nonStriker}
          disabledOptionIds={[
            matchState.striker?.id || '',
            matchState.nonStriker?.id || ''
          ].filter(Boolean)}
          pendingWicketType={matchState.pendingWicketType}
          onSubmit={handleSetNewBatsman}
        />
      )}

      {!matchState.needsNewBatsman && matchState.needsNewBowler && (
        <PlayerSelectionModal
          type="BOWLER"
          options={bowlingPlayers}
          disabledOptionIds={[matchState.currentBowler?.id || '']}
          onSubmit={(player) => setNewBowler(player)}
        />
      )}

    </div>
  );
}
