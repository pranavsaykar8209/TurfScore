import { useState, useCallback, useRef } from 'react';
import { MatchState, Delivery, DeliveryType } from '../types';
import { inningsService } from '../../../services/innings.service';
import { matchService } from '../../../services/match.service';

export function useMatchState(initialState: Partial<MatchState>, matchConfig: { totalOvers: number; teamSize: number }, currentInningsId: number | null, matchId: number | null = null) {
  const matchIdRef = useRef(matchId);
  matchIdRef.current = matchId;
  const currentInningsIdRef = useRef(currentInningsId);
  currentInningsIdRef.current = currentInningsId;

  const [state, setState] = useState<MatchState>({
    totalRuns: 0,
    extraRuns: 0,
    totalWickets: 0,
    currentOver: 0,
    currentBall: 0,
    striker: initialState.striker || null,
    nonStriker: initialState.nonStriker || null,
    currentBowler: initialState.currentBowler || null,
    overs: [],
    currentOverDeliveries: [],
    batterStats: {},
    bowlerStats: {},
    innings: initialState.innings || 1,
    isInningsComplete: initialState.isInningsComplete || false,
    isMatchComplete: initialState.isMatchComplete || false,
    ...initialState,
    needsNewBatsman: false,
    needsNewBowler: false,
    pendingWicketType: undefined,
    outPlayers: initialState.outPlayers || [],
  });

  const [history, setHistory] = useState<MatchState[]>([]);

  const saveHistory = useCallback(() => {
    setHistory((prev) => [...prev, structuredClone(state)]);
  }, [state]);

  const syncStateToBackend = useCallback((newState: MatchState) => {
    if (currentInningsIdRef.current) {
      const legalBalls = newState.overs.reduce((acc, over) => acc + over.deliveries.filter(d => !['WIDE', 'NO_BALL'].includes(d.type)).length, 0)
                       + newState.currentOverDeliveries.filter(d => !['WIDE', 'NO_BALL'].includes(d.type)).length;
      
      const playerStatsMap = new Map<string, any>();

      // Initialize active players to ensure they are inserted even if stats are 0
      if (newState.striker) playerStatsMap.set(newState.striker.id, { playerId: parseInt(newState.striker.id) });
      if (newState.nonStriker) playerStatsMap.set(newState.nonStriker.id, { playerId: parseInt(newState.nonStriker.id) });
      if (newState.currentBowler) playerStatsMap.set(newState.currentBowler.id, { playerId: parseInt(newState.currentBowler.id) });

      // Add batter stats
      Object.entries(newState.batterStats).forEach(([id, stats]) => {
        const existing = playerStatsMap.get(id) || { playerId: parseInt(id) };
        playerStatsMap.set(id, { ...existing, runs: stats.runs, ballsFaced: stats.balls, fours: stats.fours || 0, sixes: stats.sixes || 0 });
      });

      // Add bowler stats
      Object.entries(newState.bowlerStats).forEach(([id, stats]) => {
        const existing = playerStatsMap.get(id) || { playerId: parseInt(id) };
        playerStatsMap.set(id, { ...existing, runsConceded: stats.runs, ballsBowled: stats.balls, wickets: stats.wickets, wides: stats.wides || 0, noBalls: stats.noBalls || 0, maidens: stats.maidens || 0 });
      });

      const playerStats = Array.from(playerStatsMap.values());

      // Keep existing sync for compatibility if needed, or we can just rely on the new API for deliveries.
      // But we will leave it as is to not break existing optimistic updates / innings sync.
      inningsService.updateInnings(currentInningsIdRef.current, {
        totalRuns: newState.totalRuns,
        totalWickets: newState.totalWickets,
        totalExtras: newState.extraRuns,
        legalBalls: legalBalls,
        currentStrikerId: newState.striker ? parseInt(newState.striker.id) : null,
        currentNonStrikerId: newState.nonStriker ? parseInt(newState.nonStriker.id) : null,
        currentBowlerId: newState.currentBowler ? parseInt(newState.currentBowler.id) : null,
        currentOverNumber: newState.currentOver,
        playerStats,
      }).catch(console.error);
    }
  }, []);

  const syncDeliveryToBackend = useCallback((params: any, prev: MatchState) => {
    if (matchIdRef.current && prev.striker && prev.nonStriker && prev.currentBowler) {
      let isLegalBall = true;
      let extraType = null;
      let extraRuns = 0;
      let runsOffBat = 0;

      if (params.type === 'WIDE') {
        extraType = 'wide';
        extraRuns = 1 + params.runs;
        isLegalBall = false;
      } else if (params.type === 'NO_BALL') {
        extraType = 'no_ball';
        extraRuns = 1;
        runsOffBat = params.runs;
        isLegalBall = false;
      } else if (params.type === 'BYE') {
        extraType = 'bye';
        extraRuns = params.runs;
      } else if (params.type === 'LEG_BYE') {
        extraType = 'leg_bye';
        extraRuns = params.runs;
      } else {
        runsOffBat = params.runs;
      }

      matchService.recordBall(matchIdRef.current, {
        strikerId: parseInt(prev.striker.id),
        nonStrikerId: parseInt(prev.nonStriker.id),
        bowlerId: parseInt(prev.currentBowler.id),
        runsOffBat,
        extraType: extraType as any,
        extraRuns,
        isLegalBall,
        isWicket: params.isWicket || params.type === 'WICKET',
        dismissedPlayerId: (params.isWicket || params.type === 'WICKET') ? parseInt(prev.striker.id) : null, // Simplified
      }).catch(console.error);
    }
  }, []);

  const addDelivery = useCallback((params: {
    runs: number;
    type?: DeliveryType;
    isBoundary?: boolean;
    isWicket?: boolean;
    wicketType?: string;
  }) => {
    saveHistory();

    const prev = state;
    const { runs, type = 'NORMAL', isBoundary = false, isWicket = false, wicketType } = params;
    const actualIsWicket = isWicket || type === 'WICKET';
      
      let {
        totalRuns,
        extraRuns,
        totalWickets,
        currentBall,
        currentOver,
        overs,
        currentOverDeliveries,
        striker,
        nonStriker,
        batterStats,
        bowlerStats,
        isFreeHit,
        needsNewBatsman,
        needsNewBowler,
        pendingWicketType,
      } = prev;

      const strikerId = striker?.id || '';
      const bowlerId = prev.currentBowler?.id || '';
      
      const newBatterStats = { ...batterStats };
      const newBowlerStats = { ...bowlerStats };

      if (strikerId && !newBatterStats[strikerId]) {
        newBatterStats[strikerId] = { runs: 0, balls: 0, fours: 0, sixes: 0 };
      }
      if (bowlerId && !newBowlerStats[bowlerId]) {
        newBowlerStats[bowlerId] = { runs: 0, balls: 0, wickets: 0, wides: 0, noBalls: 0, maidens: 0 };
      }

      const currentBatterStat = strikerId ? { ...newBatterStats[strikerId] } : { runs: 0, balls: 0, fours: 0, sixes: 0 };
      const currentBowlerStat = bowlerId ? { ...newBowlerStats[bowlerId] } : { runs: 0, balls: 0, wickets: 0, wides: 0, noBalls: 0, maidens: 0 };

      let runsToAddTeam = 0;
      let runsToAddExtra = 0;
      let runsToAddBatter = 0;
      let ballsToAddBatter = 0;
      let runsToAddBowler = 0;
      let ballsToAddBowler = 0;
      let ballsToAddOver = 0;
      let wicketsToAdd = 0;
      let changeStrike = false;
      let newNeedsNewBatsman = needsNewBatsman;
      let newNeedsNewBowler = needsNewBowler;
      let newPendingWicketType = pendingWicketType;
      let widesToAdd = 0;
      let noBallsToAdd = 0;
      let foursToAdd = 0;
      let sixesToAdd = 0;

      if (actualIsWicket) {
        wicketsToAdd = 1;
        ballsToAddBatter = 1;
        ballsToAddBowler = 1;
        ballsToAddOver = 1;
        runsToAddTeam = runs;
        runsToAddBatter = runs;
        runsToAddBowler = runs;
        if (runs % 2 !== 0) changeStrike = true; // In case batters crossed on a run-out
        newNeedsNewBatsman = true;
        newPendingWicketType = wicketType || 'BOWLED';
      } else if (type === 'WIDE') {
        runsToAddTeam = 1 + runs;
        runsToAddExtra = 1 + runs;
        runsToAddBatter = 0;
        ballsToAddBatter = 0;
        runsToAddBowler = 1 + runs;
        widesToAdd = 1 + runs;
        ballsToAddBowler = 0;
        ballsToAddOver = 0;
        if (runs % 2 !== 0) changeStrike = true;
      } else if (type === 'NO_BALL') {
        runsToAddTeam = 1 + runs;
        runsToAddExtra = 1;
        runsToAddBatter = runs;
        ballsToAddBatter = 1;
        runsToAddBowler = 1 + runs;
        noBallsToAdd = 1;
        ballsToAddBowler = 0;
        ballsToAddOver = 0;
        if (runs % 2 !== 0) changeStrike = true;
        if (isBoundary && runs === 4) foursToAdd = 1;
        if (isBoundary && runs === 6) sixesToAdd = 1;
      } else if (type === 'BYE' || type === 'LEG_BYE') {
        runsToAddTeam = runs;
        runsToAddExtra = runs;
        runsToAddBatter = 0;
        ballsToAddBatter = 1;
        runsToAddBowler = 0;
        ballsToAddBowler = 1;
        ballsToAddOver = 1;
        if (runs % 2 !== 0) changeStrike = true;
      } else {
        runsToAddTeam = runs;
        runsToAddBatter = runs;
        ballsToAddBatter = 1;
        runsToAddBowler = runs;
        ballsToAddBowler = 1;
        ballsToAddOver = 1;
        if (runs % 2 !== 0) changeStrike = true;
        if (isBoundary && runs === 4) foursToAdd = 1;
        if (isBoundary && runs === 6) sixesToAdd = 1;
      }

      currentBatterStat.runs += runsToAddBatter;
      currentBatterStat.balls += ballsToAddBatter;
      currentBatterStat.fours = (currentBatterStat.fours || 0) + foursToAdd;
      currentBatterStat.sixes = (currentBatterStat.sixes || 0) + sixesToAdd;
      
      currentBowlerStat.runs += runsToAddBowler;
      currentBowlerStat.balls += ballsToAddBowler;
      currentBowlerStat.wides = (currentBowlerStat.wides || 0) + widesToAdd;
      currentBowlerStat.noBalls = (currentBowlerStat.noBalls || 0) + noBallsToAdd;
      if (actualIsWicket) currentBowlerStat.wickets += wicketsToAdd;

      if (strikerId) newBatterStats[strikerId] = currentBatterStat;
      if (bowlerId) newBowlerStats[bowlerId] = currentBowlerStat;

      totalRuns += runsToAddTeam;
      extraRuns = (extraRuns || 0) + runsToAddExtra;
      totalWickets += wicketsToAdd;
      currentBall += ballsToAddOver;

      const delivery: Delivery = {
        id: Date.now().toString(),
        runs,
        type,
        isBoundary,
        isWicket: actualIsWicket,
        wicketType,
        bowlerId,
        batterId: strikerId,
      };

      currentOverDeliveries = [...currentOverDeliveries, delivery];

      if (changeStrike) {
        const temp = striker;
        striker = nonStriker;
        nonStriker = temp;
      }

      if (currentBall >= 6) {
        overs = [...overs, { overNumber: currentOver + 1, deliveries: currentOverDeliveries, isComplete: true }];
        currentOver = currentOver + 1;
        currentBall = 0;
        currentOverDeliveries = [];
        
        // Swap strike at end of over
        const temp = striker;
        striker = nonStriker;
        nonStriker = temp;
        
        newNeedsNewBowler = true;
      }

      let nextIsFreeHit = isFreeHit;
      if (type === 'NO_BALL') {
        nextIsFreeHit = true;
      } else if (type !== 'WIDE') {
        nextIsFreeHit = false;
      }

      const newState: MatchState = {
        ...prev,
        totalRuns,
        extraRuns,
        totalWickets,
        currentBall,
        currentOver,
        overs,
        currentOverDeliveries,
        striker,
        nonStriker,
        batterStats: newBatterStats,
        bowlerStats: newBowlerStats,
        isFreeHit: nextIsFreeHit,
        needsNewBatsman: newNeedsNewBatsman,
        needsNewBowler: newNeedsNewBowler,
        pendingWicketType: newPendingWicketType,
      };

      // Evaluate match rules
      if (newState.innings === 1) {
        const isAllOut = newState.totalWickets >= matchConfig.teamSize - 1;
        const isOversComplete = newState.currentOver >= matchConfig.totalOvers;

        if (isAllOut || isOversComplete) {
          newState.isInningsComplete = true;
          newState.target = newState.totalRuns + 1;
          newState.needsNewBatsman = false;
          newState.needsNewBowler = false;
        }
      } else if (newState.innings === 2) {
        const isTargetReached = newState.target ? newState.totalRuns >= newState.target : false;
        const isAllOut = newState.totalWickets >= matchConfig.teamSize - 1;
        const isOversComplete = newState.currentOver >= matchConfig.totalOvers;

        if (isTargetReached) {
          newState.isMatchComplete = true;
          newState.isInningsComplete = true;
          newState.matchWinner = 'BATTING_TEAM';
          newState.winMargin = `${matchConfig.teamSize - 1 - newState.totalWickets} wickets`;
          newState.needsNewBatsman = false;
          newState.needsNewBowler = false;
        } else if (isAllOut || isOversComplete) {
          newState.isMatchComplete = true;
          newState.isInningsComplete = true;
          
          if (newState.target && newState.totalRuns < newState.target - 1) {
             newState.matchWinner = 'BOWLING_TEAM';
             newState.winMargin = `${newState.target - 1 - newState.totalRuns} runs`;
          } else {
             newState.matchWinner = 'TIE';
          }
          newState.needsNewBatsman = false;
          newState.needsNewBowler = false;
        }
      }

    // Sync with backend asynchronously
    // We only call syncDeliveryToBackend because the backend's recordBall API 
    // automatically handles updating player stats and innings totals.
    syncDeliveryToBackend(params, prev);

    setState(newState);
  }, [saveHistory, state, syncStateToBackend, syncDeliveryToBackend]);

  const setNewBatsman = useCallback((player: import('../../match-setup/types').PlayerSelection, outPlayerId?: string) => {
    const prev = state;
    let { striker, nonStriker } = prev;
      if (striker?.id === outPlayerId) {
        striker = player;
      } else if (nonStriker?.id === outPlayerId) {
        nonStriker = player;
      } else {
        // Fallback: if no outPlayerId specified, just replace whoever is null, or default to striker
        if (!striker) striker = player;
        else if (!nonStriker) nonStriker = player;
        else striker = player; 
      }
      const newState = {
        ...prev,
        striker,
        nonStriker,
        needsNewBatsman: false,
        pendingWicketType: undefined,
        outPlayers: outPlayerId ? [...prev.outPlayers, outPlayerId] : prev.outPlayers,
      };
    syncStateToBackend(newState);
    setState(newState);
  }, [state, syncStateToBackend]);

  const setNewBowler = useCallback((player: import('../../match-setup/types').PlayerSelection) => {
    const prev = state;
    const newState = {
        ...prev,
        currentBowler: player,
        needsNewBowler: false,
      };
    syncStateToBackend(newState);
    setState(newState);
  }, [state, syncStateToBackend]);

  const addWicket = useCallback(() => {
    addDelivery({ runs: 0, isWicket: true });
  }, [addDelivery]);

  const endOver = useCallback(() => {
    saveHistory();
    const prev = state;
    const newState = {
        ...prev,
        overs: [...prev.overs, { overNumber: prev.currentOver + 1, deliveries: prev.currentOverDeliveries, isComplete: true }],
        currentOver: prev.currentOver + 1,
        currentBall: 0,
        currentOverDeliveries: [],
        striker: prev.nonStriker,
        nonStriker: prev.striker,
      };
    syncStateToBackend(newState);
    setState(newState);
  }, [saveHistory, state, syncStateToBackend]);

  const changeStrike = useCallback(() => {
    saveHistory();
    const prev = state;
    const newState = {
        ...prev,
        striker: prev.nonStriker,
        nonStriker: prev.striker,
      };
    syncStateToBackend(newState);
    setState(newState);
  }, [saveHistory, state, syncStateToBackend]);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const previousState = newHistory.pop()!;
    setHistory(newHistory);
    setState(previousState);
    
    // We do NOT call syncStateToBackend here because undoLastBall handles reverting stats and totals on the backend
    if (matchIdRef.current) {
       matchService.undoLastBall(matchIdRef.current).catch(console.error);
    }
  }, [history, syncStateToBackend]);

  const startSecondInnings = useCallback((setup: { striker: import('../../match-setup/types').PlayerSelection | null; nonStriker: import('../../match-setup/types').PlayerSelection | null; bowler: import('../../match-setup/types').PlayerSelection | null; }) => {
    saveHistory();
    setState((prev) => ({
      ...prev,
      innings: 2,
      isInningsComplete: false,
      isMatchComplete: false,
      firstInningsScore: {
        runs: prev.totalRuns,
        wickets: prev.totalWickets,
        overs: prev.currentOver,
        overDeliveries: prev.currentBall,
      },
      totalRuns: 0,
      extraRuns: 0,
      totalWickets: 0,
      currentOver: 0,
      currentBall: 0,
      overs: [],
      currentOverDeliveries: [],
      batterStats: {},
      bowlerStats: {},
      outPlayers: [],
      striker: setup.striker,
      nonStriker: setup.nonStriker,
      currentBowler: setup.bowler,
      isFreeHit: false,
      needsNewBatsman: false,
      needsNewBowler: false,
      pendingWicketType: undefined,
    }));
  }, [saveHistory]);

  return {
    state,
    addDelivery,
    addWicket,
    endOver,
    changeStrike,
    undo,
    setNewBatsman,
    setNewBowler,
    startSecondInnings,
    canUndo: history.length > 0,
  };
}
