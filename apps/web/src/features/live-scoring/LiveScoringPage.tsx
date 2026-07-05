import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMatchState } from './hooks/useMatchState';
import {

  ScoreboardCard,
  PlayersActiveCard,
  CurrentOverTracker,
  ScoringKeypad,
  PlayerSelectionModal,
  InningsCompleteModal,
  MatchCompleteModal,
  OpeningBatsmenSelectionModal,
} from './components';

import { Navbar } from '@/components/shared';
import homeContent from '@/data/home.json';

export default function LiveScoringPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = location.state;

  // Fallback for direct navigation without state
  const sessionData = routeState?.sessionData || { sessionName: 'Local Match', teamA: 'Team A', teamB: 'Team B' };
  const tossData = routeState?.tossData || { winner: 'A', decision: 'BAT' };
  const matchSetup = routeState?.matchSetup || { striker: null, nonStriker: null, bowler: null, overs: 20 };

  const isTeamAInitialBatting = 
    (tossData.winner === 'A' && tossData.decision === 'BAT') ||
    (tossData.winner === 'B' && tossData.decision === 'BOWL');

  // We can't use matchState yet because it's not initialized. Wait, hooks can't be conditional.
  // We need to use `matchState` to derive batting team. We can initialize `useMatchState` first.

  const {
    state: matchState,
    addDelivery,
    undo,
    changeStrike,
    setNewBatsman,
    setNewBowler,
    startSecondInnings,
    canUndo,
  } = useMatchState({
    striker: matchSetup.striker,
    nonStriker: matchSetup.nonStriker,
    currentBowler: matchSetup.bowler,
  }, {
    totalOvers: matchSetup.overs,
    teamSize: (sessionData.players?.length || 2) / 2
  });

  const currentBattingTeamIsA = matchState.innings === 1 ? isTeamAInitialBatting : !isTeamAInitialBatting;

  const battingTeamName = currentBattingTeamIsA ? sessionData.teamA : sessionData.teamB;
  const bowlingTeamName = currentBattingTeamIsA ? sessionData.teamB : sessionData.teamA;

  const battingTeamId = currentBattingTeamIsA ? 'A' : 'B';
  const bowlingTeamId = currentBattingTeamIsA ? 'B' : 'A';

  const battingPlayers = sessionData.players?.filter((p: { team: string }) => p.team === battingTeamId) || [];
  const bowlingPlayers = sessionData.players?.filter((p: { team: string }) => p.team === bowlingTeamId) || [];

  const [setupStep, setSetupStep] = useState<'NONE' | 'BATSMEN' | 'BOWLER'>('NONE');
  const [secondInningsData, setSecondInningsData] = useState<any>({});

  const [showStrikeWarning, setShowStrikeWarning] = useState(false);

  const handleSetNewBatsman = (player: import('../match-setup/types').PlayerSelection, outPlayerId?: string) => {
    if (matchState.pendingWicketType === 'RUN_OUT') {
      setShowStrikeWarning(true);
      setTimeout(() => setShowStrikeWarning(false), 5000);
    }
    setNewBatsman(player, outPlayerId);
  };

  const handleStartSecondInnings = () => {
    setSetupStep('BATSMEN');
  };

  const handleSecondInningsBatsmenSelection = (striker: import('../match-setup/types').PlayerSelection, nonStriker: import('../match-setup/types').PlayerSelection) => {
    setSecondInningsData({ ...secondInningsData, striker, nonStriker });
    setSetupStep('BOWLER');
  };

  const handleSecondInningsBowlerSelection = (bowler: import('../match-setup/types').PlayerSelection) => {
    startSecondInnings({
      ...secondInningsData,
      bowler
    });
    setSetupStep('NONE');
    setSecondInningsData({});
  };

  const isScoringDisabled = matchState.isInningsComplete || matchState.isMatchComplete;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans pb-12 pt-32 relative">
      <Navbar data={homeContent.navbar} />

      <div className="max-w-5xl w-full mx-auto px-4 mt-4 lg:mt-6 flex flex-col gap-4 lg:gap-6">
        
        {/* Top: Scoreboard */}
        <ScoreboardCard 
          battingTeamName={battingTeamName}
          bowlingTeamName={bowlingTeamName}
          matchState={matchState}
          totalOvers={matchSetup.overs}
        />

        {/* Middle section: Active Players & Over Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="lg:col-span-4">
            <PlayersActiveCard matchState={matchState} highlightStrikeChange={showStrikeWarning} />
          </div>
          <div className="hidden lg:block lg:col-span-8">
            <CurrentOverTracker matchState={matchState} />
          </div>
        </div>

        {/* Bottom section: Keypad & Controls */}
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          <div className="col-span-1">
            <ScoringKeypad 
              onAddDelivery={isScoringDisabled ? () => {} : addDelivery}
              onUndo={isScoringDisabled ? () => {} : undo}
              onChangeStrike={isScoringDisabled ? () => {} : changeStrike}
              canUndo={canUndo && !isScoringDisabled}
              isFreeHit={matchState.isFreeHit}
            />
          </div>
        </div>
      </div>

      {matchState.needsNewBatsman && (
        <PlayerSelectionModal 
          type="BATSMAN"
          options={battingPlayers.filter((p: { id: string }) => !matchState.outPlayers?.includes(p.id))}
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

      {matchState.isInningsComplete && matchState.innings === 1 && setupStep === 'NONE' && (
        <InningsCompleteModal
          matchState={matchState}
          onStartSecondInnings={handleStartSecondInnings}
        />
      )}

      {setupStep === 'BATSMEN' && (
        <OpeningBatsmenSelectionModal
          options={bowlingPlayers}
          onSubmit={handleSecondInningsBatsmenSelection}
        />
      )}

      {setupStep === 'BOWLER' && (
        <PlayerSelectionModal
          key={setupStep}
          title="Select Opening Bowler"
          type="BOWLER"
          options={battingPlayers}
          onSubmit={handleSecondInningsBowlerSelection}
        />
      )}

      {matchState.isMatchComplete && (
        <MatchCompleteModal
          matchState={matchState}
          battingTeamName={battingTeamName}
          bowlingTeamName={bowlingTeamName}
          onViewDashboard={() => navigate('/')}
        />
      )}

    </div>
  );
}
