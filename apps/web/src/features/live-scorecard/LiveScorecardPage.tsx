import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Navbar } from '../../components/shared';
import homeContent from '../../data/home.json';
import { useLiveScorecard } from './hooks/useLiveScorecard';
import {
  CurrentBattersCard,
  BowlerAndOverCard,
  InningsTabs,
  InningsScorecard,
  PlayerChips,
  RecentOversCard,
} from './components';
import ScoreboardCard from '../live-scoring/components/ScoreboardCard';
import { MatchState } from '../live-scoring/types';

export default function LiveScorecardPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const { liveData, statsData, isLoading, error } = useLiveScorecard(matchId ? parseInt(matchId) : null);
  const [activeTab, setActiveTab] = useState<number>(1);

  // Sync active tab to current innings initially
  useMemo(() => {
    if (liveData?.match?.currentInning && liveData.match.currentInning !== activeTab) {
      setActiveTab(liveData.match.currentInning);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveData?.match?.currentInning]);

  if (error === 'NOT_FOUND') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans transition-colors">
        <Navbar data={homeContent.navbar} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Match Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400">The match you are looking for does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans transition-colors">
        <Navbar data={homeContent.navbar} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 p-6 rounded-2xl border border-red-200 dark:border-red-900/50 font-bold">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !liveData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans transition-colors">
        <Navbar data={homeContent.navbar} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
        </div>
      </div>
    );
  }

  const { sessionData, matchSetup, currentInningsData, allInningsData, match } = liveData;

  const isMatchScheduled = match.status === 'scheduled';
  const isSecondInnings = match.currentInning === 2;

  const totalOvers = matchSetup?.overs || 20;
  
  // Find current active inning from allInningsData
  const activeInningDetails = allInningsData?.find((i: any) => i.inningNumber === activeTab);
  
  let currentExtras = { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 };
  let fallOfWickets: any[] = activeInningDetails?.fow || [];
  let dismissals: string[] = activeInningDetails?.dismissals || [];
  let allOvers: any[] = activeInningDetails?.overs || [];
  
  if (currentInningsData) {
    currentExtras.wides = statsData.filter(s => s.inning?.inningNumber === activeTab).reduce((sum, s) => sum + (s.wides || 0), 0);
    currentExtras.noBalls = statsData.filter(s => s.inning?.inningNumber === activeTab).reduce((sum, s) => sum + (s.noBalls || 0), 0);
    currentExtras.total = currentExtras.wides + currentExtras.noBalls;
  }

  let currentOverNumber = currentInningsData?.currentOverNumber || 0;
  let currentBallNumber = (currentInningsData?.currentOverDeliveries || []).filter(
    (d: any) => !['WIDE', 'NO_BALL'].includes(d.type)
  ).length;

  if (currentBallNumber >= 6) {
    currentOverNumber += Math.floor(currentBallNumber / 6);
    currentBallNumber = currentBallNumber % 6;
  }

  const totalRuns = currentInningsData?.totalRuns || 0;
  const totalWickets = currentInningsData?.totalWickets || 0;

  // Map active batters
  const batters = [];
  if (matchSetup?.striker) {
    const sId = matchSetup.striker.id;
    const stat = currentInningsData?.batterStats?.[sId] || { runs: 0, balls: 0 };
    batters.push({ id: sId, name: matchSetup.striker.name, runs: stat.runs, balls: stat.balls, isStriker: true });
  }
  if (matchSetup?.nonStriker) {
    const nsId = matchSetup.nonStriker.id;
    const stat = currentInningsData?.batterStats?.[nsId] || { runs: 0, balls: 0 };
    batters.push({ id: nsId, name: matchSetup.nonStriker.name, runs: stat.runs, balls: stat.balls, isStriker: false });
  }

  // Map active bowler
  let bowler = null;
  if (matchSetup?.bowler) {
    const bId = matchSetup.bowler.id;
    const stat = currentInningsData?.bowlerStats?.[bId] || { runs: 0, balls: 0, wickets: 0 };
    const bOvers = Math.floor((stat.balls || 0) / 6);
    const bBalls = (stat.balls || 0) % 6;
    const bEcon = stat.balls > 0 ? ((stat.runs / stat.balls) * 6).toFixed(2) : '0.00';
    bowler = {
      id: bId,
      name: matchSetup.bowler.name,
      overs: `${bOvers}.${bBalls}`,
      runs: stat.runs,
      wickets: stat.wickets,
      economy: bEcon
    };
  }

  // Find target from past innings
  let target = undefined;
  
  if (isSecondInnings) {
    const firstInningsStats = statsData.filter(s => s.inning?.inningNumber === 1);
    if (firstInningsStats.length > 0) {
      const firstInningsRuns = firstInningsStats.reduce((sum, s) => sum + (s.runs || 0), 0);
      const firstInningsExtras = firstInningsStats.reduce((sum, s) => sum + (s.wides || 0) + (s.noBalls || 0), 0);
      target = firstInningsRuns + firstInningsExtras + 1;
    }
  }

  const activeInningStats = statsData
    .filter(s => s.inning?.inningNumber === activeTab)
    .sort((a, b) => a.playerStatsId - b.playerStatsId);
  
  let battingTeamLetter = 'A';
  let bowlingTeamLetter = 'B';
  
  if (activeInningDetails) {
    battingTeamLetter = activeInningDetails.battingTeamId === sessionData.teamAId ? 'A' : 'B';
    bowlingTeamLetter = activeInningDetails.bowlingTeamId === sessionData.teamAId ? 'A' : 'B';
  } else if (activeInningStats.length > 0) {
    // Fallback if activeInningDetails not found but stats exist
    const statTeamId = activeInningStats.find(s => s.ballsFaced > 0 || s.runs > 0)?.teamId;
    battingTeamLetter = statTeamId === sessionData.teamAId ? 'A' : 'B';
    bowlingTeamLetter = statTeamId === sessionData.teamAId ? 'B' : 'A';
  }

  const battingScorecard = activeInningStats
    .filter(s => s.ballsFaced > 0 || s.runs > 0 || dismissals.includes(s.playerId.toString()) || (activeTab === match.currentInning && (s.playerId.toString() === matchSetup?.striker?.id || s.playerId.toString() === matchSetup?.nonStriker?.id)))
    .map(s => ({
      id: s.playerId.toString(),
      name: s.player?.playerName || 'Unknown',
      runs: s.runs || 0,
      balls: s.ballsFaced || 0,
      fours: s.fours || 0,
      sixes: s.sixes || 0,
      isOut: dismissals.includes(s.playerId.toString()),
      outDesc: dismissals.includes(s.playerId.toString()) ? 'out' : undefined,
      isStriker: activeTab === match.currentInning && s.playerId.toString() === matchSetup?.striker?.id,
      isNonStriker: activeTab === match.currentInning && s.playerId.toString() === matchSetup?.nonStriker?.id,
    }));

  const bowlingScorecard = activeInningStats
    .filter(s => s.ballsBowled > 0 || s.runsConceded > 0 || (activeTab === match.currentInning && s.playerId.toString() === matchSetup?.bowler?.id))
    .map(s => ({
      id: s.playerId.toString(),
      name: s.player?.playerName || 'Unknown',
      overs: Math.floor((s.ballsBowled || 0) / 6) + ((s.ballsBowled || 0) % 6) / 10,
      balls: (s.ballsBowled || 0) % 6,
      runs: s.runsConceded || 0,
      wickets: s.wickets || 0,
      maidens: s.maidens || 0,
      wides: s.wides || 0,
      noBalls: s.noBalls || 0,
      economy: s.ballsBowled > 0 ? ((s.runsConceded / s.ballsBowled) * 6).toFixed(2) : '0.00',
      isCurrent: activeTab === match.currentInning && s.playerId.toString() === matchSetup?.bowler?.id,
    }));

  const allPlayers = sessionData?.players || [];
  const battingTeamPlayers = allPlayers.filter((p: any) => p.team === battingTeamLetter);
  const bowlingTeamPlayers = allPlayers.filter((p: any) => p.team === bowlingTeamLetter);

  const yetToBat = battingTeamPlayers
    .filter((p: any) => !battingScorecard.find(b => b.id === p.id))
    .map((p: any) => ({ id: p.id, name: p.name }));
    
  const yetToBowl = bowlingTeamPlayers
    .filter((p: any) => !bowlingScorecard.find(b => b.id === p.id))
    .map((p: any) => ({ id: p.id, name: p.name }));

  const teamAName = sessionData.teamA;
  const teamBName = sessionData.teamB;
  const activeBattingTeamName = battingTeamLetter === 'A' ? teamAName : teamBName;
  const activeBowlingTeamName = bowlingTeamLetter === 'A' ? teamAName : teamBName;

  // Compute isFreeHit based on recent deliveries
  let isFreeHit = false;
  const currentDeliveries = currentInningsData?.currentOverDeliveries || [];
  for (let i = currentDeliveries.length - 1; i >= 0; i--) {
    const d = currentDeliveries[i];
    if (d.type === 'NO_BALL') {
      isFreeHit = true;
      break;
    } else if (d.type !== 'WIDE') {
      isFreeHit = false;
      break;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans relative overflow-x-hidden transition-colors">
      <Navbar data={homeContent.navbar} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 pt-32 pb-16 relative z-10 flex flex-col">
        
        {isMatchScheduled ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 text-center shadow-sm dark:shadow-xl">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Waiting for Toss</h2>
            <p className="text-slate-500 dark:text-slate-400">The match has not started yet.</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <ScoreboardCard
                battingTeamName={activeBattingTeamName}
                bowlingTeamName={activeBowlingTeamName}
                matchState={{
                  totalRuns,
                  totalWickets,
                  currentOver: currentOverNumber,
                  currentBall: currentBallNumber,
                  target,
                  extraRuns: currentExtras.total,
                  isFreeHit,
                } as MatchState}
                totalOvers={totalOvers}
              />
            </div>

            {match.status === 'completed' ? (
              <div className="bg-white dark:bg-slate-900 border border-brand-green/20 dark:border-brand-green/10 rounded-[2rem] p-8 md:p-12 text-center shadow-sm dark:shadow-xl mb-4 md:mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 dark:bg-brand-green/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <h2 className="text-4xl md:text-5xl font-black text-brand-dark dark:text-brand-green uppercase tracking-wide mb-4 relative z-10">
                  {match.winnerTeamId ? (match.winnerTeamId === sessionData.teamAId ? `${teamAName} Won!` : `${teamBName} Won!`) : 'Match Tied!'}
                </h2>
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-bold relative z-10 capitalize">
                  {match.winnerTeamId ? `Won by ${match.winMargin || ''} ${match.winType || ''}` : 'Scores are level'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mb-4 md:mb-8">
                <div className="lg:col-span-4">
                  <CurrentBattersCard batters={batters} />
                </div>
                <div className="lg:col-span-8">
                  <BowlerAndOverCard 
                    bowler={bowler} 
                    deliveries={currentInningsData?.currentOverDeliveries || []} 
                  />
                </div>
              </div>
            )}

            <div className="mt-4 md:mt-8">
              <InningsTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                showSecondInnings={match.currentInning === 2}
              />

              {activeInningStats.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-12 text-center shadow-sm mt-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Innings Yet to Start</h3>
                </div>
              ) : (
                <div className="flex flex-col gap-6 mt-4">
                  <InningsScorecard 
                    battingTeam={activeBattingTeamName}
                    bowlingTeam={activeBowlingTeamName}
                    batters={battingScorecard}
                    bowlers={bowlingScorecard}
                    extras={currentExtras}
                    fallOfWickets={fallOfWickets}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PlayerChips title="Yet to Bat" players={yetToBat} />
                    <PlayerChips title="Yet to Bowl" players={yetToBowl} />
                  </div>
                  
                  {/* Recent Overs */}
                  {allOvers.length > 0 && (
                    <RecentOversCard overs={[...allOvers].reverse().map(over => {
                      const firstBall = over.deliveries[0];
                      const bowlerName = allPlayers.find((p: any) => p.id === firstBall?.bowlerId)?.name;
                      return { ...over, bowlerName };
                    })} />
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
