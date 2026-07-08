import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchState } from '../hooks/useMatchState';
import {
  ScoreboardCard,
  PlayersActiveCard,
  CurrentOverTracker,
  ScoringKeypad,
  PlayerSelectionModal,
  InningsCompleteModal,
  MatchCompleteModal,
  OpeningBatsmenSelectionModal,
} from './index';

import { Navbar } from '@/components/shared';
import homeContent from '@/data/home.json';
import { inningsService } from '../../../services/innings.service';

export default function LiveScoringBoard({ sessionData, tossData, matchSetup, matchId, initialInningsData }: any) {
  const navigate = useNavigate();
  const [currentInningsId, setCurrentInningsId] = useState<number | null>(initialInningsData?.inningId || null);

  const isTeamAInitialBatting = 
    (tossData.winner === 'A' && tossData.decision === 'BAT') ||
    (tossData.winner === 'B' && tossData.decision === 'BOWL');

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
    totalRuns: initialInningsData?.totalRuns || 0,
    totalWickets: initialInningsData?.totalWickets || 0,
    extraRuns: initialInningsData?.totalExtras || 0,
    currentOver: initialInningsData?.legalBalls ? Math.floor(initialInningsData.legalBalls / 6) : 0,
    currentBall: initialInningsData?.legalBalls ? initialInningsData.legalBalls % 6 : 0,
    innings: initialInningsData?.inningNumber || 1,
    striker: matchSetup?.striker || null,
    nonStriker: matchSetup?.nonStriker || null,
    currentBowler: matchSetup?.bowler || null,
  }, {
    totalOvers: matchSetup?.overs || 20,
    teamSize: (sessionData.players?.length || 2) / 2
  }, currentInningsId);

  useEffect(() => {
    if (matchId && !initialInningsData) {
      inningsService.getCurrentInnings(matchId)
        .then(data => setCurrentInningsId(data.inningId))
        .catch(err => console.error('Failed to fetch current innings:', err));
    }
  }, [matchId, initialInningsData, matchState.innings]);

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

  const handleSetNewBatsman = (player: import('../../match-setup/types').PlayerSelection, outPlayerId?: string) => {
    if (matchState.pendingWicketType === 'RUN_OUT') {
      setShowStrikeWarning(true);
      setTimeout(() => setShowStrikeWarning(false), 5000);
    }
    setNewBatsman(player, outPlayerId);
  };

  const handleStartSecondInnings = async () => {
    if (currentInningsId) {
      await inningsService.endInnings(currentInningsId).catch(console.error);
    }
    setSetupStep('BATSMEN');
  };

  const handleSecondInningsBatsmenSelection = (striker: import('../../match-setup/types').PlayerSelection, nonStriker: import('../../match-setup/types').PlayerSelection) => {
    setSecondInningsData({ ...secondInningsData, striker, nonStriker });
    setSetupStep('BOWLER');
  };

  const handleSecondInningsBowlerSelection = async (bowler: import('../../match-setup/types').PlayerSelection) => {
    if (matchId) {
      const innings = await inningsService.startSecondInnings(matchId).catch(console.error);
      if (innings) {
        await inningsService.updateInnings(innings.inningId, {
          currentStrikerId: secondInningsData.striker ? parseInt(secondInningsData.striker.id) : null,
          currentNonStrikerId: secondInningsData.nonStriker ? parseInt(secondInningsData.nonStriker.id) : null,
          currentBowlerId: bowler ? parseInt(bowler.id) : null,
          currentOverNumber: 0,
        }).catch(console.error);
        setCurrentInningsId(innings.inningId);
      }
    }
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
          totalOvers={matchSetup?.overs || 20}
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
